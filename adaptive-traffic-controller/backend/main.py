# import asyncio
# import os
# import shutil
# import time
# from typing import List
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import uvicorn

# from models import TrafficSettings
# from traffic_scheduler import TrafficScheduler
# from simulation import TrafficSimulation

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Upload folder initialize karein
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# settings = TrafficSettings()
# scheduler = TrafficScheduler(settings)
# simulation = TrafficSimulation()

# clients: List[WebSocket] = []

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     clients.append(websocket)
#     try:
#         while True:
#             await websocket.receive_text()
#     except WebSocketDisconnect:
#         clients.remove(websocket)

# async def traffic_loop():
#     last_time = time.time()
#     while True:
#         current_time = time.time()
#         dt = current_time - last_time
#         last_time = current_time

#         if settings.simulation_mode and not scheduler.state.paused:
#             counts = simulation.generate_counts()
#             for direction, count in counts.items():
#                 app_state = scheduler.state.approaches[direction]
#                 app_state.raw_count = count
#                 app_state.weighted_score = simulation.calculate_weighted_score(count, settings.weights)
                
#             scheduler.state.total_vehicles = sum(c for c in counts.values())

#         scheduler.tick(current_time, dt)
        
#         state_dict = scheduler.state.model_dump()
#         state_dict['events'] = scheduler.events[-15:]
#         state_dict['scenario'] = simulation.scenarios[simulation.current_scenario]
#         state_dict['mode'] = settings.mode
        
#         for client in list(clients):
#             try:
#                 await client.send_json(state_dict)
#             except:
#                 clients.remove(client)
                
#         await asyncio.sleep(1.0)

# @app.on_event("startup")
# async def startup_event():
#     asyncio.create_task(traffic_loop())

# @app.get("/api/traffic-state")
# async def get_state():
#     return scheduler.state.model_dump()

# # NEW: Video Upload and Analysis API Endpoint
# @app.post("/api/upload")
# async def upload_video(file: UploadFile = File(...)):
#     try:
#         file_path = os.path.join(UPLOAD_DIR, file.filename)
#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
        
#         scheduler.log_event(f"Video uploaded: '{file.filename}'. YOLO Analysis started.")
        
#         return {
#             "status": "success",
#             "message": "Video uploaded and queued for processing!",
#             "filename": file.filename
#         }
#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# @app.post("/api/control/pause")
# async def pause_sim():
#     scheduler.state.paused = True
#     scheduler.log_event("Simulation paused.")
#     return {"status": "paused"}

# @app.post("/api/control/resume")
# async def resume_sim():
#     scheduler.state.paused = False
#     scheduler.log_event("Simulation resumed.")
#     return {"status": "resumed"}

# @app.post("/api/control/reset")
# async def reset_sim():
#     global scheduler
#     scheduler = TrafficScheduler(settings)
#     scheduler.log_event("Simulation reset.")
#     return {"status": "reset"}

# class EmergencyRequest(BaseModel):
#     direction: str

# @app.post("/api/control/emergency")
# async def emergency_override(req: EmergencyRequest):
#     if req.direction in scheduler.state.approaches:
#         scheduler.apply_emergency(req.direction)
#         return {"status": "emergency_triggered"}
#     return {"status": "invalid_direction"}

# @app.post("/api/mode/{mode}")
# async def set_mode(mode: str):
#     if mode in ['fixed', 'adaptive']:
#         settings.mode = mode
#         scheduler.log_event(f"Mode switched to {mode}.")
#         return {"status": "success", "mode": mode}
#     return {"status": "invalid_mode"}

# class ScenarioRequest(BaseModel):
#     scenario_id: int

# @app.post("/api/scenario")
# async def set_scenario(req: ScenarioRequest):
#     if simulation.set_scenario(req.scenario_id):
#         scheduler.log_event(f"Switched to scenario: {simulation.scenarios[req.scenario_id]}")
#         return {"status": "success"}
#     return {"status": "invalid_scenario"}

# @app.get("/api/settings")
# async def get_settings():
#     return settings.model_dump()

# @app.post("/api/settings")
# async def update_settings(new_settings: TrafficSettings):
#     global settings
#     settings = new_settings
#     scheduler.settings = settings
#     scheduler.log_event("Settings updated.")
#     return {"status": "success"}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
import os
import shutil
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()

# 1. CORS Configuration for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Health check endpoint (Prevents 404 on root domain)
@app.get("/")
def home():
    return {"status": "SIH Traffic Analysis API is running"}

# 3. Load lightweight YOLOv8 Nano model
model = YOLO("yolov8n.pt")

# Vehicle class IDs in COCO dataset (2: car, 3: motorcycle, 5: bus, 7: truck)
VEHICLE_CLASSES = [2, 3, 5, 7]

@app.post("/api/upload")
async def analyze_video(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    try:
        # Save uploaded video in chunks (Prevents Render 512MB RAM OOM Crash)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Could not open video file.")

        max_vehicles_detected = 0
        cars, bikes, heavies = 0, 0, 0
        frame_count = 0
        processed_frames = 0
        MAX_PROCESSED_FRAMES = 30  # Safety limit to prevent Render HTTP timeout (Max ~10-15 seconds)

        while cap.isOpened() and processed_frames < MAX_PROCESSED_FRAMES:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            # Process every 15th frame for faster CPU performance on Render
            if frame_count % 15 != 0:
                continue

            processed_frames += 1

            # Run YOLOv8 inference
            results = model(frame, verbose=False)[0]
            
            current_cars, current_bikes, current_heavies = 0, 0, 0
            for box in results.boxes:
                cls_id = int(box.cls[0])
                if cls_id == 2:
                    current_cars += 1
                elif cls_id == 3:
                    current_bikes += 1
                elif cls_id in [5, 7]:
                    current_heavies += 1

            total_current = current_cars + current_bikes + current_heavies
            
            # Track maximum vehicle density frame
            if total_current > max_vehicles_detected:
                max_vehicles_detected = total_current
                cars = current_cars
                bikes = current_bikes
                heavies = current_heavies

        cap.release()

        # Calculate Density and Recommended Green Light Time
        density_percent = min(100, int((max_vehicles_detected / 30) * 100))
        if density_percent > 70:
            density_label = f"High Density ({density_percent}%)"
            green_time = f"{min(60, 20 + max_vehicles_detected * 1)} Seconds"
        elif density_percent > 35:
            density_label = f"Medium Density ({density_percent}%)"
            green_time = f"{15 + max_vehicles_detected * 1} Seconds"
        else:
            density_label = f"Low Density ({density_percent}%)"
            green_time = "15 Seconds"

        return {
            "filename": file.filename,
            "totalVehicles": max_vehicles_detected,
            "cars": cars,
            "bikes": bikes,
            "trucksBuses": heavies,
            "density": density_label,
            "recommendedGreenTime": green_time
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    finally:
        # Guarantee cleanup of temporary video file even if process fails
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        if os.path.exists(temp_path):
            os.remove(temp_path)