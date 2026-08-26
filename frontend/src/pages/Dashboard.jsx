import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ todayCo2e: 0, weeklyCo2e: 0, monthlyCo2e: 0, previousWeeklyCo2e: 0 });
  const [categories, setCategories] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, logsRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/categories'),
          api.get('/activities')
        ]);
        setSummary(sumRes.data);
        
        // Map backend category format [categoryName, totalCo2]
        const formattedCats = catRes.data.map(item => ({
          name: item[0],
          value: item[1] || 0
        })).filter(c => c.value > 0);
        
        setCategories(formattedCats);
        setRecentLogs(logsRes.data.slice(0, 5)); // top 5
      } catch(err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, []);
  
  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#8b5cf6'];
  const pieData = categories.length > 0 ? categories : [{ name: 'No Data', value: 1 }];
  
  // Basic mock line data since backend doesn't have a daily trend endpoint yet
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
          <p className="text-gray-500 mt-1 font-medium">Personal Sustainability Analytics from Database</p>
        </div>
        <button onClick={() => navigate('/log-activity')} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" /> Log Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Footprint", value: summary.todayCo2e.toFixed(1), unit: "kg CO₂e", icon: "🌍", color: "text-blue-600", bg: "bg-blue-50", trend: "Live", good: true },
          { title: "Weekly Total", value: summary.weeklyCo2e.toFixed(1), unit: "kg CO₂e", icon: "📅", color: "text-purple-600", bg: "bg-purple-50", trend: "Live", good: false },
          { title: "Monthly Total", value: summary.monthlyCo2e.toFixed(1), unit: "kg CO₂e", icon: "🎯", color: "text-green-600", bg: "bg-green-50", trend: "Live", good: true },
          { title: "Trees Equivalent", value: Math.floor(summary.monthlyCo2e / 20), unit: "Trees", icon: "🌳", color: "text-emerald-600", bg: "bg-emerald-50", trend: "Live", good: true }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <div className={`flex items-center text-xs font-bold uppercase tracking-wider text-green-500`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
            <div className="flex items-baseline">
              <h2 className="text-4xl font-extrabold text-gray-900">{stat.value}</h2>
              <span className="ml-2 text-gray-500 font-medium">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Emissions Trend (This Week)</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="current" stroke="#16a34a" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8, strokeWidth: 0}} name="This Week" />
                <Line type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} strokeDasharray="6 6" dot={false} name="Last Week" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Category Breakdown</h3>
          <p className="text-sm text-gray-500 mb-6">Distribution of your footprint (DB)</p>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-gray-600 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Recent DB Activity Logs</h3>
          <button onClick={() => navigate('/activity-history')} className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline">View Full History &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          {recentLogs.length === 0 ? (
            <p className="p-6 text-gray-500">No activities logged yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-5">Log ID</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Activity</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5 text-sm font-semibold text-gray-900">ACT-{log.id}</td>
                    <td className="p-5 text-sm font-medium text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{log.category}</span>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-700">{log.activityType} ({log.quantity} {log.unit})</td>
                    <td className="p-5 text-sm text-gray-500">{log.logDate}</td>
                    <td className="p-5 text-sm font-bold text-gray-900 text-right">{log.calculatedCo2e.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
