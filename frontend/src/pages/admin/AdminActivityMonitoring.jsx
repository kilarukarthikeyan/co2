import { useState, useEffect } from 'react';
import { Activity, Search, Trash2, RotateCw } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminActivityMonitoring() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/activities');
      setActivities(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity log permanently?')) {
      try {
        await api.delete(`/admin/activities/${id}`);
        fetchActivities();
      } catch (err) {
        alert('Failed to delete activity log.');
      }
    }
  };

  const filteredActivities = activities.filter(a => {
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchType = a.activityType && a.activityType.toLowerCase().includes(q);
      const matchMemo = a.memo && a.memo.toLowerCase().includes(q);
      const matchUser = a.user && a.user.name && a.user.name.toLowerCase().includes(q);
      if (!matchType && !matchMemo && !matchUser) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Activity Monitoring</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Live telemetry and audit trail of user activities across the platform.</p>
        </div>
        <button onClick={fetchActivities} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all flex items-center gap-2 self-start cursor-pointer">
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-500'}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by activity, memo, or user name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 cursor-pointer">
            <option value="ALL">All Categories</option>
            <option value="Transport">Transport</option>
            <option value="Electricity">Electricity</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {filteredActivities.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Activity & Quantity</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Calculated CO₂e</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredActivities.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-gray-900">ACT-{log.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{log.user ? log.user.name : 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.category === 'Transport' ? 'bg-green-100 text-green-700' :
                        log.category === 'Food' ? 'bg-orange-100 text-orange-700' :
                        log.category === 'Electricity' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div>{log.activityType} ({log.quantity} {log.unit})</div>
                      {log.memo && <div className="text-[10px] text-gray-400">{log.memo}</div>}
                    </td>
                    <td className="p-4 text-gray-500">{log.logDate}</td>
                    <td className="p-4 text-right font-bold text-gray-900">{Number(log.calculatedCo2e).toFixed(2)} kg</td>
                    <td className="p-4 pr-6 text-right">
                      <button onClick={() => handleDelete(log.id)} className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">No activity logs recorded matching criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}