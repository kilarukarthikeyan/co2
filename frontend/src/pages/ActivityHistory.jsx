import { useState, useEffect } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';

export default function ActivityHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/activities');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      try {
        await api.delete(`/activities/${id}`);
        setLogs(logs.filter(log => log.id !== id));
      } catch(err) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Activity History</h1>
          <p className="text-gray-500 mt-1 font-medium">Review and manage all your previously logged activities.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search activities..." className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all w-80 shadow-sm" />
          </div>
          <button className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5 mr-2" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-500">Loading activities from database...</div>
          ) : logs.length === 0 ? (
             <div className="p-10 text-center text-gray-500">No activities found. Go log some!</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-6">ID</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Activity Details</th>
                  <th className="p-6">Date</th>
                  <th className="p-6 text-right">CO₂e (kg)</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-6 text-sm font-semibold text-gray-900">ACT-{log.id}</td>
                    <td className="p-6 text-sm font-medium text-gray-500">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        log.category === 'Transport' ? 'bg-green-100 text-green-700' :
                        log.category === 'Food' ? 'bg-orange-100 text-orange-700' :
                        log.category === 'Electricity' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{log.category}</span>
                    </td>
                    <td className="p-6 text-sm font-medium text-gray-700">
                      {log.activityType} ({log.quantity} {log.unit}) <br/>
                      <span className="text-xs text-gray-400">{log.memo}</span>
                    </td>
                    <td className="p-6 text-sm text-gray-500">{log.logDate}</td>
                    <td className="p-6 text-sm font-bold text-gray-900 text-right">{log.calculatedCo2e.toFixed(2)}</td>
                    <td className="p-6 text-center">
                      <button onClick={() => handleDelete(log.id)} className="text-red-400 hover:text-red-600 font-medium text-sm transition-opacity">
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
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
