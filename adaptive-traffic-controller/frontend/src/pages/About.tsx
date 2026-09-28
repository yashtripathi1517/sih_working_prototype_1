export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">About Adaptive AI Traffic Signal Controller</h1>
      
      <div className="space-y-8 text-slate-300">
        <section className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-3">Problem Statement</h2>
          <p className="leading-relaxed">
            Traditional fixed-time traffic signals operate on pre-programmed cycles regardless of actual traffic volume. 
            This leads to unnecessary idling, increased carbon emissions, and severe traffic congestion during rush hours 
            or uneven traffic flows.
          </p>
        </section>

        <section className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-3">How it Works</h2>
          <ul className="space-y-4 list-disc pl-5">
            <li>
              <strong className="text-primary">Computer Vision (YOLOv8):</strong> The system uses state-of-the-art object detection to identify and classify vehicles (cars, buses, trucks, motorcycles) on each road approach.
            </li>
            <li>
              <strong className="text-primary">Weighted Density:</strong> Different vehicles have different impacts on traffic. A bus (weight 2.5) requires more clearance time than a motorcycle (weight 0.5).
            </li>
            <li>
              <strong className="text-primary">Adaptive Scheduling:</strong> The algorithm calculates a priority score for each direction based on current weighted density and waiting time. This prevents starvation of low-traffic roads while efficiently clearing heavy queues.
            </li>
          </ul>
        </section>

        <section className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-3">Limitations & Disclaimer</h2>
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded text-yellow-200/80 mb-4">
            <strong>Disclaimer:</strong> This is an AI-assisted traffic signal simulation designed for hackathon demonstration purposes only. It is not certified for real public-road deployment.
          </div>
          <p className="text-sm">
            Current limitations include occlusion (large vehicles hiding smaller ones), reduced accuracy in heavy rain or low-light conditions, and dependency on camera angles.
          </p>
        </section>
        
        <section className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-3">Future Scope</h2>
          <p className="leading-relaxed">
            Future improvements could include edge deployment on Jetson Nano or Raspberry Pi devices, integration with physical Arduino/ESP32 LED controllers, automated emergency vehicle siren detection via audio analysis, and predictive cloud analytics based on historical traffic patterns.
          </p>
        </section>
      </div>
    </div>
  );
}
