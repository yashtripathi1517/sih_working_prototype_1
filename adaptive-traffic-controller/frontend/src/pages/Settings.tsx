export default function Settings() {
  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Timing Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Minimum Green Time (s)</label>
              <input type="number" defaultValue={10} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Maximum Green Time (s)</label>
              <input type="number" defaultValue={40} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Yellow Time (s)</label>
              <input type="number" defaultValue={3} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">All-Red Clearance (s)</label>
              <input type="number" defaultValue={2} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Vehicle Weights (Density Multipliers)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Car</label>
              <input type="number" step="0.1" defaultValue={1.0} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Motorcycle</label>
              <input type="number" step="0.1" defaultValue={0.5} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Bus / Truck</label>
              <input type="number" step="0.1" defaultValue={2.5} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg transition-colors shadow-lg shadow-primary/20">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
