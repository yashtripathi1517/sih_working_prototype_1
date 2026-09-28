import time
from models import TrafficSettings, ApproachState, SystemState

class TrafficScheduler:
    def __init__(self, settings: TrafficSettings):
        self.settings = settings
        self.state = SystemState(
            approaches={
                "North": ApproachState(direction="North"),
                "South": ApproachState(direction="South"),
                "East": ApproachState(direction="East"),
                "West": ApproachState(direction="West"),
            }
        )
        self.internal_phase = "init" # init, green, yellow, all_red
        self.phase_start_time = time.time()
        self.current_duration = 0
        self.events = []
        self.emergency_override = None

    def log_event(self, message: str):
        self.events.append({"timestamp": time.time(), "message": message})
        if len(self.events) > 100:
            self.events.pop(0)

    def calculate_priority(self, direction: str) -> float:
        app = self.state.approaches[direction]
        return app.weighted_score + 0.15 * app.waiting_time

    def update_queue_levels(self):
        for app in self.state.approaches.values():
            if app.weighted_score < 5:
                app.queue_level = "Low"
            elif app.weighted_score < 15:
                app.queue_level = "Medium"
            else:
                app.queue_level = "High"

    def select_next_green(self) -> str:
        if self.emergency_override:
            next_dir = self.emergency_override
            self.emergency_override = None
            return next_dir

        directions = list(self.state.approaches.keys())
        # If all scores are 0 and no waiting time, just pick next in round robin or North
        best_dir = directions[0]
        max_priority = -1
        
        for d in directions:
            if self.state.current_green == d:
                continue # Don't select the one that just finished
            p = self.calculate_priority(d)
            if p > max_priority:
                max_priority = p
                best_dir = d
                
        return best_dir

    def calculate_green_time(self, direction: str) -> int:
        if self.settings.mode == 'fixed':
            return self.settings.fixed_green_time
            
        score = self.state.approaches[direction].weighted_score
        green_time = int(10 + 2 * score)
        return max(self.settings.min_green_time, min(green_time, self.settings.max_green_time))

    def tick(self, current_time: float, dt: float):
        if self.state.paused:
            self.phase_start_time += dt # Shift start time to maintain duration
            return

        # Update waiting times
        for d, app in self.state.approaches.items():
            if app.signal_state == 'red':
                app.waiting_time += int(dt)
        
        self.update_queue_levels()

        elapsed = current_time - self.phase_start_time
        self.state.time_remaining = max(0, int(self.current_duration - elapsed))

        if self.internal_phase == "init":
            next_dir = self.select_next_green()
            self.transition_to_green(next_dir, current_time)

        elif self.internal_phase == "green":
            # Check for emergency override - cut green short
            if self.emergency_override and self.emergency_override != self.state.current_green:
                self.log_event(f"Emergency override triggered for {self.emergency_override}. Cutting green short.")
                self.transition_to_yellow(current_time)
            elif elapsed >= self.current_duration:
                self.transition_to_yellow(current_time)

        elif self.internal_phase == "yellow":
            if elapsed >= self.current_duration:
                self.transition_to_all_red(current_time)

        elif self.internal_phase == "all_red":
            if elapsed >= self.current_duration:
                next_dir = self.select_next_green()
                self.transition_to_green(next_dir, current_time)

    def transition_to_green(self, direction: str, current_time: float):
        for app in self.state.approaches.values():
            app.signal_state = 'red'
        
        self.state.approaches[direction].signal_state = 'green'
        self.state.approaches[direction].waiting_time = 0
        self.state.current_green = direction
        
        self.current_duration = self.calculate_green_time(direction)
        self.phase_start_time = current_time
        self.internal_phase = "green"
        
        score = self.state.approaches[direction].weighted_score
        if self.settings.mode == 'adaptive':
            self.log_event(f"{direction} selected because of priority score. Green time set to {self.current_duration}s based on weighted density {score:.1f}.")
        else:
            self.log_event(f"{direction} selected. Green time fixed at {self.current_duration}s.")

    def transition_to_yellow(self, current_time: float):
        if self.state.current_green:
            self.state.approaches[self.state.current_green].signal_state = 'yellow'
        self.current_duration = self.settings.yellow_time
        self.phase_start_time = current_time
        self.internal_phase = "yellow"
        self.log_event(f"Yellow phase for {self.state.current_green}.")

    def transition_to_all_red(self, current_time: float):
        for app in self.state.approaches.values():
            app.signal_state = 'red'
        self.current_duration = self.settings.all_red_time
        self.phase_start_time = current_time
        self.internal_phase = "all_red"
        self.state.current_green = None
        self.log_event("All-red clearance cycle.")

    def apply_emergency(self, direction: str):
        self.emergency_override = direction
