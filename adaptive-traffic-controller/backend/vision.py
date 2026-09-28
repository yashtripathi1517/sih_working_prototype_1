import cv2
import numpy as np
import os

class VisionPipeline:
    def __init__(self):
        self.model = None
        self.enabled = False
        self.classes = {2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck', 1: 'bicycle'} # COCO indices
        
    def load_model(self):
        if self.model is None:
            try:
                from ultralytics import YOLO
                self.model = YOLO('yolov8n.pt')
                self.enabled = True
            except Exception as e:
                print("Could not load YOLOv8:", e)
                self.enabled = False

    def process_frame(self, frame, confidence_threshold=0.4):
        if not self.enabled or self.model is None:
            return frame, {}

        results = self.model(frame, conf=confidence_threshold, verbose=False)[0]
        
        counts = {'car': 0, 'motorcycle': 0, 'bus': 0, 'truck': 0, 'bicycle': 0}
        
        for box in results.boxes:
            cls_id = int(box.cls[0])
            if cls_id in self.classes:
                class_name = self.classes[cls_id]
                counts[class_name] += 1
                
                # Draw bounding box
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f'{class_name} {conf:.2f}', (x1, y1 - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                            
        return frame, counts
