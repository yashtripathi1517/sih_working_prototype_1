import type { SystemState } from '../lib/api';

export default function DecisionLog({ data }: { data: SystemState | null }) {
  if (!data || !data.events) return <div className="bg-surface p-4 rounded-xl border border-slate-700 h-64 animate-pulse"></div>;

  // show events in reverse chronological order
  const events = [...data.events].reverse();

  return (
    <div className="bg-surface p-4 rounded-xl border border-slate-700 h-64 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">AI Decision Log</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {events.map((evt, i) => {
          const isNew = i === 0;
          return (
            <div key={evt.timestamp} className={`text-sm border-l-2 pl-3 py-1 ${isNew ? 'border-primary text-white bg-primary/10 rounded-r' : 'border-slate-600 text-slate-400'}`}>
              <div className="text-xs text-slate-500 mb-1">
                {new Date(evt.timestamp * 1000).toLocaleTimeString()}
              </div>
              <p>{evt.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
