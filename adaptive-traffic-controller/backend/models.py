from pydantic import BaseModel
from typing import Dict, List, Literal, Optional

class VehicleWeights(BaseModel):
    motorcycle: float = 0.5
    bicycle: float = 0.3
    car: float = 1.0
    bus: float = 2.5
    truck: float = 2.5

class TrafficSettings(BaseModel):
    min_green_time: int = 10
    max_green_time: int = 40
    yellow_time: int = 3
    all_red_time: int = 2
    confidence_threshold: float = 0.4
    weights: VehicleWeights = VehicleWeights()
    mode: Literal['fixed', 'adaptive'] = 'adaptive'
    simulation_mode: bool = True
    detection_overlay: bool = True
    fixed_green_time: int = 20

class ApproachState(BaseModel):
    direction: str
    raw_count: int = 0
    weighted_score: float = 0.0
    waiting_time: int = 0
    signal_state: Literal['red', 'green', 'yellow'] = 'red'
    queue_level: Literal['Low', 'Medium', 'High'] = 'Low'

class SystemState(BaseModel):
    approaches: Dict[str, ApproachState]
    current_green: Optional[str] = None
    time_remaining: int = 0
    total_vehicles: int = 0
    status: Literal['Simulation Mode', 'Camera Connected', 'Video Analysis Mode'] = 'Simulation Mode'
    paused: bool = False
    
class EventLog(BaseModel):
    timestamp: float
    message: str
