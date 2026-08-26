import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Community Leaderboard</h1>
        <p className="text-gray-500 font-medium text-lg">Compare your score with peers worldwide (Live from DB).</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {leaders.map((user) => (
            <div key={user.rank} className="flex items-center p-6 transition-colors hover:bg-gray-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-6 ${
                user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                user.rank === 2 ? 'bg-gray-200 text-gray-600' :
                user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                'bg-gray-100 text-gray-500'
              }`}>{user.rank}</div>
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {user.name.charAt(0)}
              </div>
              
              <div className="ml-5 flex-1">
                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" /> {user.badge}
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-3xl font-extrabold text-gray-900">{user.score}</span>
                <span className="text-sm font-medium text-gray-500 ml-1">pts</span>
              </div>
            </div>
          ))}
          {leaders.length === 0 && (
            <div className="p-10 text-center text-gray-500">Loading DB data...</div>
          )}
        </div>
      </div>
    </div>
  );
}
