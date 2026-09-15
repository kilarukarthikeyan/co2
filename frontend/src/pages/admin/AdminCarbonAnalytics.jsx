import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, RotateCw } from 'lucide-react';
import { 
  LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../../api/axiosConfig';

export default function AdminCarbonAnalytics() {
  const [dailyEmissions, setDailyEmissions] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [dailyRes, catRes, sumRes] = await Promise.all([
        api.get('/admin/daily-emissions?days=30'),
        api.get('/admin/category-breakdown'),
        api.get('/admin/summary')
      ]);
      const formatted = (dailyRes.data || []).map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        co2e: Number(d.co2e) || 0
      }));
      setDailyEmissions(formatted);
      setCategoryBreakdown(catRes.data || []);
      setSummary(sumRes.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Platform Carbon Analytics</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Deep-dive telemetry and macro emission analytics across all user activities.</p>
        </div>
        <button onClick={fetchAnalytics} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all flex items-center gap-2 self-start cursor-pointer">
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-1">30-Day Platform Emissions Trend</h3>
          <p className="text-xs text-gray-400 mb-6">Total daily kg CO₂e recorded across the community.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyEmissions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} dy={5} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="co2e" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Category Distribution</h3>
          <p className="text-xs text-gray-400 mb-6">Proportion of carbon footprint per activity category.</p>
          <div className="h-72 flex items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="totalCo2e" nameKey="category" cx="50%" cy="50%" outerRadius={90} innerRadius={60} paddingAngle={4}>
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} formatter={(val) => [`${Number(val).toFixed(2)} kg CO₂e`, 'CO₂e']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-400">No category data recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}