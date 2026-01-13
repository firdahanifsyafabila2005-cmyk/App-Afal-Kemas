
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { AfalRecord } from '../types';

interface DashboardProps {
  records: AfalRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const totals = useMemo(() => {
    return {
      totalBungkus: records.reduce((sum, r) => sum + r.jumlah, 0),
      totalEvents: records.length,
      avgPerEvent: records.length > 0 ? (records.reduce((sum, r) => sum + r.jumlah, 0) / records.length).toFixed(1) : 0
    };
  }, [records]);

  const defectData = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      counts[r.keterangan] = (counts[r.keterangan] || 0) + r.jumlah;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const momentData = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      counts[r.momen] = (counts[r.momen] || 0) + r.jumlah;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#6366f1'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Afal (Bungkus)" value={totals.totalBungkus} color="blue" />
        <StatCard title="Total Kejadian Sampling" value={totals.totalEvents} color="amber" />
        <StatCard title="Rata-rata Afal per Kejadian" value={totals.avgPerEvent} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pareto Chart for Defects */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Jenis Afal</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Moments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Momen Kemunculan Terbesar</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={momentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {momentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; color: 'blue' | 'amber' | 'emerald' }> = ({ title, value, color }) => {
  const bg = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };
  
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${bg[color]}`}>
      <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
};

export default Dashboard;
