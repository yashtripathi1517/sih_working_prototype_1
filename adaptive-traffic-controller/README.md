# Adaptive AI Traffic Signal Controller

A complete, polished, locally runnable hackathon prototype that simulates an AI-assisted traffic signal controller. The system dynamically changes simulated traffic-light green durations based on vehicle density per road approach.

**Note:** This is a DISPLAY / DEMO prototype only. It is not certified for real public-road deployment.

## Features
- **Deterministic Demo Mode:** A reliable built-in simulation engine with 5 distinct scenarios (Normal, Heavy North, Rush Hour, Emergency, Late Night).
- **Computer Vision Ready:** Includes a `vision.py` pipeline ready for YOLOv8 (nano) integration to process actual video or webcam feeds.
- **Adaptive Scheduling:** Uses an algorithm that calculates a priority score based on weighted vehicle density and waiting time to prevent road starvation.
- **Modern Dashboard:** Built with React, Vite, Tailwind CSS, and Recharts, providing a dark, premium command-center UI.
- **Real-Time Websockets:** FastAPI backend broadcasts live state updates at 1Hz.

## Project Structure
- `/backend`: Python FastAPI application containing the scheduler algorithm, simulation logic, and API endpoints.
- `/frontend`: React + TypeScript frontend using Tailwind CSS and Recharts.
- `/sample_videos`: Placeholder directory for actual traffic footage.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup (Python)
Open a terminal and navigate to the project root.

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
python main.py
```
The backend API will run on `http://localhost:8000`.

### 2. Frontend Setup (React/Vite)
Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 3. Running the Tests
To run unit tests for the traffic scheduler:
```bash
cd backend
pytest tests/
```

## How to use Computer Vision mode
1. Place `.mp4` traffic footage in the `sample_videos` folder.
2. The `vision.py` module is stubbed out. Ensure you have `ultralytics` installed (included in requirements) and configure the OpenCV VideoCapture in `main.py` if you wish to parse live frames instead of simulation data.
3. The system will automatically fall back to deterministic simulation mode if video processing is unavailable.

## Demo Script for Judges
1. Open the dashboard. Point out the animated junction and the initial "Normal balanced traffic" scenario.
2. Show the real-time **Decision Log** on the bottom right, explaining that it is a transparent, rule-based system, not a black box.
3. Change the scenario to **"Rush hour mixed traffic"** and show how the density scores and green-time durations adapt.
4. Press the **Emergency Override** button for "West" and show how the system immediately safely cuts the current green light and transitions.
5. Go to the **About** page to explain the weighting logic and limitations.
