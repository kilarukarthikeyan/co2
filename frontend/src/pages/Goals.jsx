import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Goals() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/goals');
        setGoals(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGoals();
  }, []);

  // For visual demo if DB is empty
  const hasDbGoal = goals.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Goals</h1>
          <p className="text-gray-500 mt-1 font-medium">Data synced from database.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 transition-all">
          <Target className="w-5 h-5 mr-2" /> Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-10 rounded-[2rem] shadow-xl shadow-green-200/50 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-xl font-bold mb-8">Active Goal: {hasDbGoal ? 'Target Reduction' : 'Monthly Reduction (Demo)'}</h3>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-green-200 text-sm font-semibold uppercase tracking-wider mb-1">Target Reduction</p>
              <h2 className="text-5xl font-extrabold">{hasDbGoal ? goals[0].targetReductionPercentage : '20'}%</h2>
            </div>
            <div className="w-24 h-24 rounded-full border-8 border-green-400/30 border-t-white flex items-center justify-center text-xl font-bold">
              {hasDbGoal ? '0' : '82'}%
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium text-green-100">
              <span>Baseline: {hasDbGoal ? 'DB Baseline' : '120 kg'}</span>
              <span>Target: {hasDbGoal ? goals[0].targetValue + ' kg' : '96 kg'}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div className="bg-white h-3 rounded-full" style={{ width: hasDbGoal ? '0%' : '82%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Past Achievements</h3>
          <ul className="space-y-6">
            <li className="flex items-start p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-5 flex-shrink-0 bg-yellow-100 text-yellow-600">🏆</div>
              <div>
                <h4 className="font-bold text-gray-900">Zero Emission Commute</h4>
                <p className="text-gray-500 text-sm mt-1 mb-2">Used public transport for 7 days straight.</p>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">May 2026</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
