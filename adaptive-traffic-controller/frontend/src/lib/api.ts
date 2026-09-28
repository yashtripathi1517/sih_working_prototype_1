import { useEffect, useState, useRef } from 'react';

// In production (Vercel), set VITE_API_URL and VITE_WS_URL to your Render backend URL
// e.g. VITE_API_URL=https://adaptive-traffic-backend.onrender.com/api
//      VITE_WS_URL=wss://adaptive-traffic-backend.onrender.com/ws
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws';

export interface ApproachState {
  direction: string;
  raw_count: number;
  weighted_score: number;
  waiting_time: number;
  signal_state: 'red' | 'green' | 'yellow';
  queue_level: 'Low' | 'Medium' | 'High';
}

export interface SystemState {
  approaches: Record<string, ApproachState>;
  current_green: string | null;
  time_remaining: number;
  total_vehicles: number;
  status: string;
  paused: boolean;
  events?: any[];
  scenario?: string;
  mode?: string;
}

export function useTrafficData() {
  const [data, setData] = useState<SystemState | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 2000);
      };
      
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed);
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };
      
      wsRef.current = ws;
    };

    connect();
    
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { data, connected };
}

export async function controlApi(action: 'pause' | 'resume' | 'reset') {
  return fetch(`${API_BASE}/control/${action}`, { method: 'POST' });
}

export async function triggerEmergency(direction: string) {
  return fetch(`${API_BASE}/control/emergency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction })
  });
}

export async function setScenario(scenario_id: number) {
  return fetch(`${API_BASE}/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id })
  });
}

export async function setMode(mode: 'fixed' | 'adaptive') {
  return fetch(`${API_BASE}/mode/${mode}`, { method: 'POST' });
}
