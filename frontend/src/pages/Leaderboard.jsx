import { useState, useEffect } from 'react';
import { Star, Trophy } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const first = leaders.find(l => l.rank === 1) || { name: 'Alex M.', score: 850, badge: 'Eco Master' };
  const second = leaders.find(l => l.rank === 2) || { name: 'Sarah K.', score: 820, badge: 'Earth Saver' };
  const third = leaders.find(l => l.rank === 3) || { name: 'David L.', score: 790, badge: 'Green Hero' };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Community Leaderboard</h1>
        <p className="text-gray-500 font-medium text-lg">Compare your score with peers worldwide (Top 50 Ranks).</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end h-64 mb-12 space-x-6">
        <div className="w-1/3 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center text-xl z-10 -mb-5">🥈</div>
          <div className="w-full bg-gradient-to-t from-gray-300 to-gray-50 rounded-t-3xl h-32 flex flex-col items-center justify-center text-gray-700 border border-gray-200 shadow-lg">
            <span className="font-bold mt-4 text-sm md:text-base">{second.name}</span>
            <span className="font-extrabold text-2xl">{second.score}</span>
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 border-4 border-white shadow-2xl flex items-center justify-center text-3xl z-10 -mb-6">👑</div>
          <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-50 rounded-t-3xl h-40 flex flex-col items-center justify-center text-yellow-900 border border-yellow-200 shadow-xl">
            <span className="font-bold mt-6 text-base md:text-lg">{first.name}</span>
            <span className="font-extrabold text-3xl">{first.score}</span>
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 border-4 border-white shadow-xl flex items-center justify-center text-xl z-10 -mb-5">🥉</div>
          <div className="w-full bg-gradient-to-t from-orange-300 to-orange-50 rounded-t-3xl h-24 flex flex-col items-center justify-center text-orange-900 border border-orange-200 shadow-lg">
            <span className="font-bold mt-4 text-sm md:text-base">{third.name}</span>
            <span className="font-extrabold text-2xl">{third.score}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ranks list */}
        <div className="md:col-span-2 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-gray-500 font-medium">Loading leaderboard...</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {leaders.map((user) => (
                <div key={user.rank} className="flex items-center p-6 transition-colors hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                    user.rank === 2 ? 'bg-gray-200 text-gray-600' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{user.rank}</div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{user.name}</h3>
                    <p className="text-gray-500 text-xs font-semibold flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-current" /> {user.badge}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-gray-900">{user.score}</span>
                    <span className="text-xs font-medium text-gray-500 ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* follow their habits */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Trophy className="w-5 h-5 mr-2 text-green-600"/> Habits of the Top Users</h3>
          <ul className="space-y-4 text-sm font-medium text-gray-600">
            <li className="p-3 bg-gray-50 rounded-xl">🚴 Commutes using bicycles instead of private transport daily.</li>
            <li className="p-3 bg-gray-50 rounded-xl">🥦 100% vegetarian meals logged over the last 15 days.</li>
            <li className="p-3 bg-gray-50 rounded-xl">☀️ Utilizes residential solar panel source for active power.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
