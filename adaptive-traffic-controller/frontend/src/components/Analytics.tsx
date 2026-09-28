import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SystemState } from '../lib/api';

export default function Analytics({ data }: { data: SystemState | null }) {
  if (!data) return <div className="bg-surface p-4 rounded-xl border border-slate-700 h-64 animate-pulse"></div>;

  const chartData = Object.entries(data.approaches).map(([dir, app]) => ({
    name: dir,
    score: Number(app.weighted_score.toFixed(1)),
    count: app.raw_count,
    waiting: app.waiting_time
  }));

  return (
    <div className="bg-surface p-4 rounded-xl border border-slate-700 h-64 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Traffic Score by Approach</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#334155'}}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.score >= 15 ? '#ef4444' : entry.score >= 8 ? '#facc15' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
