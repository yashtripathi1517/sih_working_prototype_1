import random
import math
from models import VehicleWeights

class TrafficSimulation:
    def __init__(self):
        self.scenarios = {
            1: "Normal balanced traffic",
            2: "Heavy traffic on North",
            3: "Rush hour mixed traffic",
            4: "Emergency vehicle from West",
            5: "Low traffic late night"
        }
        self.current_scenario = 1
        self.time_step = 0

    def set_scenario(self, scenario_id: int):
        if scenario_id in self.scenarios:
            self.current_scenario = scenario_id
            self.time_step = 0
            return True
        return False

    def generate_counts(self) -> dict:
        self.time_step += 1
        t = self.time_step
        
        # Base counts
        counts = {
            "North": 5 + int(3 * math.sin(t * 0.1)),
            "South": 5 + int(3 * math.sin(t * 0.1 + 1)),
            "East": 4 + int(2 * math.cos(t * 0.1)),
            "West": 4 + int(2 * math.cos(t * 0.1 + 1))
        }

        if self.current_scenario == 2: # Heavy North
            counts["North"] += 20
        elif self.current_scenario == 3: # Rush hour
            counts["North"] += 10
            counts["South"] += 12
            counts["East"] += 8
            counts["West"] += 9
        elif self.current_scenario == 5: # Late night
            counts = {k: max(0, v - 4) for k, v in counts.items()}
            if t % 10 == 0:
                counts["East"] += 1
        
        # Add some random noise
        for k in counts:
            counts[k] = max(0, counts[k] + random.randint(-1, 2))

        return counts
        
    def calculate_weighted_score(self, count: int, weights: VehicleWeights) -> float:
        if count == 0: return 0.0
        
        cars = int(count * 0.7)
        motorcycles = int(count * 0.2)
        heavy = count - cars - motorcycles
        
        return float(cars * weights.car + motorcycles * weights.motorcycle + heavy * weights.bus)
