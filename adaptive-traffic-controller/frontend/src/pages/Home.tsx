import { useState } from 'react';
import { useTrafficData, controlApi, triggerEmergency, setScenario, setMode } from '../lib/api';
import Junction from '../components/Junction';
import Analytics from '../components/Analytics';
import DecisionLog from '../components/DecisionLog';
import { Play, Pause, RotateCcw, AlertTriangle, Settings2 } from 'lucide-react';

export default function Home() {
  const { data, connected } = useTrafficData();
  const [overrideDir, setOverrideDir] = useState('North');

  if (!connected) {
    return <div className="flex h-full items-center justify-center p-8 text-slate-400">Connecting to server...</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-sm text-slate-400">{data?.status || 'Unknown Status'}</span>
            {data?.paused && <span className="text-sm text-yellow-500 ml-2 font-medium">(PAUSED)</span>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select 
            className="bg-surface border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            onChange={(e) => setScenario(Number(e.target.value))}
            value={data?.scenario === "Normal balanced traffic" ? 1 : data?.scenario === "Heavy traffic on North" ? 2 : data?.scenario === "Rush hour mixed traffic" ? 3 : data?.scenario === "Emergency vehicle from West" ? 4 : 5}
          >
            <option value={1}>Scenario 1: Normal balanced traffic</option>
            <option value={2}>Scenario 2: Heavy traffic on North</option>
            <option value={3}>Scenario 3: Rush hour mixed traffic</option>
            <option value={4}>Scenario 4: Emergency vehicle from West</option>
            <option value={5}>Scenario 5: Low traffic late night</option>
          </select>
          
          <div className="bg-surface rounded-lg p-1 border border-slate-700 flex">
            <button 
              onClick={() => setMode('adaptive')}
              className={`px-3 py-1 text-sm rounded ${data?.mode === 'adaptive' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >Adaptive</button>
            <button 
              onClick={() => setMode('fixed')}
              className={`px-3 py-1 text-sm rounded ${data?.mode === 'fixed' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >Fixed</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Approaches */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {['North', 'South', 'East', 'West'].map((dir) => {
            const app = data?.approaches[dir];
            if (!app) return null;
            return (
              <div key={dir} className={`bg-surface p-4 rounded-xl border transition-colors ${data?.current_green === dir ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-slate-800/80' : 'border-slate-700'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{dir}</h3>
                  <div className="flex gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
                    <div className={`w-3 h-3 rounded-full ${app.signal_state === 'red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-800'}`} />
                    <div className={`w-3 h-3 rounded-full ${app.signal_state === 'yellow' ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : 'bg-slate-800'}`} />
                    <div className={`w-3 h-3 rounded-full ${app.signal_state === 'green' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-800'}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Vehicles</div>
                    <div className="font-mono text-lg">{app.raw_count}</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Density</div>
                    <div className="font-mono text-lg text-primary">{app.weighted_score.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Waiting</div>
                    <div className="font-mono text-lg">{app.waiting_time}s</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase">Queue</div>
                    <div className={`font-medium ${app.queue_level === 'High' ? 'text-red-400' : app.queue_level === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {app.queue_level}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: Junction */}
        <div className="lg:col-span-5 flex flex-col h-full bg-surface p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Settings2 size={20} className="text-primary"/> Live Simulation</h2>
            <div className="flex gap-2">
              {data?.paused ? (
                <button onClick={() => controlApi('resume')} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"><Play size={20} fill="currentColor" /></button>
              ) : (
                <button onClick={() => controlApi('pause')} className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"><Pause size={20} fill="currentColor" /></button>
              )}
              <button onClick={() => controlApi('reset')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"><RotateCcw size={20} /></button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <Junction data={data} />
          </div>
          
          <div className="mt-6 flex gap-2">
             <select 
              value={overrideDir} 
              onChange={e => setOverrideDir(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-red-500"
             >
               <option value="North">North</option>
               <option value="South">South</option>
               <option value="East">East</option>
               <option value="West">West</option>
             </select>
             <button 
                onClick={() => triggerEmergency(overrideDir)}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
             >
               <AlertTriangle size={18} /> Emergency Override
             </button>
          </div>
        </div>

        {/* Right Column: Analytics & Logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Analytics data={data} />
          <DecisionLog data={data} />
        </div>
      </div>
    </div>
  );
}
