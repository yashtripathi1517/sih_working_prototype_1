import type { SystemState } from '../lib/api';

export default function Junction({ data }: { data: SystemState | null }) {
  if (!data) return <div className="h-64 flex items-center justify-center text-slate-500">Connecting to Junction...</div>;

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Grass/Background */}
      <div className="absolute inset-0 bg-slate-800/50"></div>
      
      {/* Roads */}
      <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-slate-700 border-x-2 border-dashed border-slate-500/30"></div>
      <div className="absolute left-0 right-0 top-[35%] bottom-[35%] bg-slate-700 border-y-2 border-dashed border-slate-500/30"></div>
      
      {/* Intersection Center */}
      <div className="absolute left-[35%] right-[35%] top-[35%] bottom-[35%] bg-slate-600"></div>

      {/* Crosswalks */}
      <div className="absolute left-[35%] right-[35%] top-[30%] h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,white_4px,white_12px)] opacity-30"></div>
      <div className="absolute left-[35%] right-[35%] bottom-[30%] h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,white_4px,white_12px)] opacity-30"></div>
      <div className="absolute top-[35%] bottom-[35%] left-[30%] w-4 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,white_4px,white_12px)] opacity-30"></div>
      <div className="absolute top-[35%] bottom-[35%] right-[30%] w-4 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,white_4px,white_12px)] opacity-30"></div>

      {/* Traffic Lights */}
      <TrafficLight pos="top" state={data.approaches['North'].signal_state} time={data.current_green === 'North' ? data.time_remaining : undefined} label="N" />
      <TrafficLight pos="bottom" state={data.approaches['South'].signal_state} time={data.current_green === 'South' ? data.time_remaining : undefined} label="S" />
      <TrafficLight pos="left" state={data.approaches['West'].signal_state} time={data.current_green === 'West' ? data.time_remaining : undefined} label="W" />
      <TrafficLight pos="right" state={data.approaches['East'].signal_state} time={data.current_green === 'East' ? data.time_remaining : undefined} label="E" />
    </div>
  );
}

function TrafficLight({ pos, state, time, label }: { pos: 'top'|'bottom'|'left'|'right', state: string, time?: number, label: string }) {
  const isTop = pos === 'top';
  const isBottom = pos === 'bottom';
  const isLeft = pos === 'left';
  const isRight = pos === 'right';
  
  let wrapperClasses = "absolute flex items-center justify-center p-2 bg-slate-950 rounded-lg border border-slate-700 shadow-lg ";
  
  if (isTop) wrapperClasses += "top-8 left-1/2 -translate-x-1/2 flex-row gap-2";
  if (isBottom) wrapperClasses += "bottom-8 left-1/2 -translate-x-1/2 flex-row gap-2";
  if (isLeft) wrapperClasses += "left-8 top-1/2 -translate-y-1/2 flex-col gap-2";
  if (isRight) wrapperClasses += "right-8 top-1/2 -translate-y-1/2 flex-col gap-2";

  const getLightClass = (color: string) => {
    const isActive = state === color;
    let base = "w-4 h-4 rounded-full transition-all duration-300 ";
    if (color === 'red') base += isActive ? "bg-red-500 shadow-[0_0_15px_#ef4444]" : "bg-red-950";
    if (color === 'yellow') base += isActive ? "bg-yellow-400 shadow-[0_0_15px_#facc15]" : "bg-yellow-950";
    if (color === 'green') base += isActive ? "bg-green-500 shadow-[0_0_15px_#22c55e]" : "bg-green-950";
    return base;
  };

  return (
    <div className={wrapperClasses}>
      <span className="text-[10px] font-bold text-slate-400 absolute -top-5">{label}</span>
      <div className={getLightClass('red')} />
      <div className={getLightClass('yellow')} />
      <div className={getLightClass('green')} />
      {time !== undefined && (
        <span className="absolute -bottom-6 text-sm font-mono font-bold text-white bg-slate-800 px-2 rounded">{time}s</span>
      )}
    </div>
  );
}
