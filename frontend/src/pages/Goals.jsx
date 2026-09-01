import { useState, useEffect } from 'react';
import { Target, Calendar } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [targetPct, setTargetPct] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', {
        targetReductionPercentage: parseFloat(targetPct),
        startDate: startDate,
        endDate: endDate
      });
      alert('Goal created successfully!');
      setTargetPct('');
      setEndDate('');
      fetchGoals();
    } catch(err) {
      alert('Failed to create goal');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Goals</h1>
        <p className="text-gray-500 mt-1 font-medium">Set and monitor target reduction percentiles dynamically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Goals list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Active Targets</h3>
            {loading ? (
              <p className="text-gray-500">Loading goals...</p>
            ) : goals.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-500 font-medium">No active goals. Set one to start tracking progress!</div>
            ) : (
              <div className="space-y-6">
                {goals.map(g => (
                  <div key={g.id} className="p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/20 border border-green-100 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">{g.status}</span>
                        <h4 className="font-extrabold text-lg text-gray-900 mt-2">Target: {g.targetReductionPercentage}% Reduction</h4>
                      </div>
                      <div className="text-right text-sm text-gray-500 font-medium">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {g.startDate} to {g.endDate}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 font-bold uppercase">
                        <span>Current Value</span>
                        <span>Target Limit: {g.targetValue.toFixed(1)} kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Goal Form */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Set New Target</h3>
          <form onSubmit={handleCreateGoal} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Target Reduction (%)</label>
              <input type="number" required placeholder="e.g. 15" value={targetPct} onChange={e => setTargetPct(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Start Date</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all text-gray-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">End Date</label>
              <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all text-gray-500" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center">
              <Target className="w-5 h-5 mr-2" /> Activate Goal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
