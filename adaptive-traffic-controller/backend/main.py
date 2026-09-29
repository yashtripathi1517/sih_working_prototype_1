import asyncio
import os
import shutil
import time
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from models import TrafficSettings
from traffic_scheduler import TrafficScheduler
from simulation import TrafficSimulation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload folder initialize karein
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

settings = TrafficSettings()
scheduler = TrafficScheduler(settings)
simulation = TrafficSimulation()

clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.remove(websocket)

async def traffic_loop():
    last_time = time.time()
    while True:
        current_time = time.time()
        dt = current_time - last_time
        last_time = current_time

        if settings.simulation_mode and not scheduler.state.paused:
            counts = simulation.generate_counts()
            for direction, count in counts.items():
                app_state = scheduler.state.approaches[direction]
                app_state.raw_count = count
                app_state.weighted_score = simulation.calculate_weighted_score(count, settings.weights)
                
            scheduler.state.total_vehicles = sum(c for c in counts.values())

        scheduler.tick(current_time, dt)
        
        state_dict = scheduler.state.model_dump()
        state_dict['events'] = scheduler.events[-15:]
        state_dict['scenario'] = simulation.scenarios[simulation.current_scenario]
        state_dict['mode'] = settings.mode
        
        for client in list(clients):
            try:
                await client.send_json(state_dict)
            except:
                clients.remove(client)
                
        await asyncio.sleep(1.0)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(traffic_loop())

@app.get("/api/traffic-state")
async def get_state():
    return scheduler.state.model_dump()

# NEW: Video Upload and Analysis API Endpoint
@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        scheduler.log_event(f"Video uploaded: '{file.filename}'. YOLO Analysis started.")
        
        return {
            "status": "success",
            "message": "Video uploaded and queued for processing!",
            "filename": file.filename
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/control/pause")
async def pause_sim():
    scheduler.state.paused = True
    scheduler.log_event("Simulation paused.")
    return {"status": "paused"}

@app.post("/api/control/resume")
async def resume_sim():
    scheduler.state.paused = False
    scheduler.log_event("Simulation resumed.")
    return {"status": "resumed"}

@app.post("/api/control/reset")
async def reset_sim():
    global scheduler
    scheduler = TrafficScheduler(settings)
    scheduler.log_event("Simulation reset.")
    return {"status": "reset"}

class EmergencyRequest(BaseModel):
    direction: str

@app.post("/api/control/emergency")
async def emergency_override(req: EmergencyRequest):
    if req.direction in scheduler.state.approaches:
        scheduler.apply_emergency(req.direction)
        return {"status": "emergency_triggered"}
    return {"status": "invalid_direction"}

@app.post("/api/mode/{mode}")
async def set_mode(mode: str):
    if mode in ['fixed', 'adaptive']:
        settings.mode = mode
        scheduler.log_event(f"Mode switched to {mode}.")
        return {"status": "success", "mode": mode}
    return {"status": "invalid_mode"}

class ScenarioRequest(BaseModel):
    scenario_id: int

@app.post("/api/scenario")
async def set_scenario(req: ScenarioRequest):
    if simulation.set_scenario(req.scenario_id):
        scheduler.log_event(f"Switched to scenario: {simulation.scenarios[req.scenario_id]}")
        return {"status": "success"}
    return {"status": "invalid_scenario"}

@app.get("/api/settings")
async def get_settings():
    return settings.model_dump()

@app.post("/api/settings")
async def update_settings(new_settings: TrafficSettings):
    global settings
    settings = new_settings
    scheduler.settings = settings
    scheduler.log_event("Settings updated.")
    return {"status": "success"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)