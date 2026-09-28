from traffic_scheduler import TrafficScheduler
from models import TrafficSettings

def test_duration_clamping():
    settings = TrafficSettings(min_green_time=10, max_green_time=40)
    scheduler = TrafficScheduler(settings)
    
    scheduler.state.approaches["North"].weighted_score = 0
    assert scheduler.calculate_green_time("North") == 10
    
    scheduler.state.approaches["North"].weighted_score = 100
    assert scheduler.calculate_green_time("North") == 40
    
    scheduler.state.approaches["North"].weighted_score = 5
    assert scheduler.calculate_green_time("North") == 20

def test_priority_scoring():
    settings = TrafficSettings()
    scheduler = TrafficScheduler(settings)
    
    scheduler.state.approaches["North"].weighted_score = 10
    scheduler.state.approaches["North"].waiting_time = 0
    assert scheduler.calculate_priority("North") == 10.0
    
    scheduler.state.approaches["North"].waiting_time = 100
    assert scheduler.calculate_priority("North") == 10.0 + 15.0

def test_starvation_prevention():
    settings = TrafficSettings()
    scheduler = TrafficScheduler(settings)
    
    scheduler.state.approaches["North"].weighted_score = 5
    scheduler.state.approaches["North"].waiting_time = 0
    
    scheduler.state.approaches["South"].weighted_score = 0
    scheduler.state.approaches["South"].waiting_time = 100
    
    assert scheduler.select_next_green() == "South"
