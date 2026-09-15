import { useState, useEffect } from 'react';
import { Trophy, Star, RotateCw } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaderboard');
      setLeaders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Community Standings & Leaderboard</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Real-time user rankings calculated from emission reductions.</p>
        </div>
        <button onClick={fetchLeaders} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all flex items-center gap-2 self-start cursor-pointer">
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-50">
        {leaders.map((user) => (
          <div key={user.rank} className="flex items-center p-5 transition-colors hover:bg-gray-50/80">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mr-4 ${
              user.rank === 1 ? 'bg-amber-100 text-amber-700' :
              user.rank === 2 ? 'bg-slate-200 text-slate-700' :
              user.rank === 3 ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {user.rank}
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4 flex-1">
              <div className="font-bold text-sm text-gray-900">{user.name}</div>
              <div className="text-gray-400 text-xs font-medium flex items-center">
                <Star className="w-3.5 h-3.5 mr-1 text-amber-400 fill-current" /> {user.badge}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-gray-900">{user.score}</span>
              <span className="text-xs font-semibold text-gray-400 ml-1">pts</span>
            </div>
          </div>
        ))}
        {leaders.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400">Loading standings...</div>
        )}
      </div>
    </div>
  );
}