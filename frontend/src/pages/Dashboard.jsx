import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ todayCo2e: 0, weeklyCo2e: 0, monthlyCo2e: 0, previousWeeklyCo2e: 0, peerPercentile: 100 });
  const [categories, setCategories] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, logsRes, tipsRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/categories'),
          api.get('/activities'),
          api.get('/analytics/recommendations')
        ]);
        setSummary(sumRes.data);
        
        const formattedCats = catRes.data.map(item => ({
          name: item[0],
          value: item[1] || 0
        })).filter(c => c.value > 0);
        
        setCategories(formattedCats);
        setRecentLogs(logsRes.data.slice(0, 5));
        setTips(tipsRes.data);
      } catch(err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#8b5cf6'];
  const pieData = categories.length > 0 ? categories : [{ name: 'Log some data!', value: 1 }];
  
  const lineData = [
    { day: 'Mon', current: 12, previous: 15 }, { day: 'Tue', current: 15, previous: 14 },
    { day: 'Wed', current: 10, previous: 18 }, { day: 'Thu', current: 14, previous: 16 },
    { day: 'Fri', current: summary.todayCo2e, previous: 22 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Personal Sustainability Analytics</p>
        </div>
        <button onClick={() => navigate('/log-activity')} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" /> Log Activity
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading footprint metrics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Today's Footprint", value: summary.todayCo2e.toFixed(1), unit: "kg CO₂e", icon: "🌍", color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Weekly Total", value: summary.weeklyCo2e.toFixed(1), unit: "kg CO₂e", icon: "📅", color: "text-purple-600", bg: "bg-purple-50" },
              { title: "Monthly Total", value: summary.monthlyCo2e.toFixed(1), unit: "kg CO₂e", icon: "🎯", color: "text-green-600", bg: "bg-green-50" },
              { title: "Peer Standing", value: `Top ${summary.peerPercentile.toFixed(0)}%`, unit: "cleanest", icon: "🏆", color: "text-amber-600", bg: "bg-amber-50" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl bg-gray-50">{stat.icon}</div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-extrabold text-gray-900">{stat.value}</h2>
                  <span className="ml-2 text-gray-500 font-medium text-sm">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Emissions Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="current" stroke="#16a34a" strokeWidth={4} />
                    <Line type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} strokeDasharray="6 6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Category Distribution</h3>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity Logs</h3>
                <button onClick={() => navigate('/activity-history')} className="text-sm font-semibold text-green-600 hover:text-green-700">View History &rarr;</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                    <th className="p-6">Category</th>
                    <th className="p-6">Activity</th>
                    <th className="p-6 text-right">CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-6 text-sm font-semibold text-gray-900">{log.category}</td>
                      <td className="p-6 text-sm text-gray-600">{log.activityType} ({log.quantity} {log.unit})</td>
                      <td className="p-6 text-sm font-bold text-gray-900 text-right">{log.calculatedCo2e.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Personalized Tips</h3>
              <ul className="space-y-4">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start p-4 bg-green-50/30 rounded-xl border border-green-50">
                    <span className="text-2xl mr-3">💡</span>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
