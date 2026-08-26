import { useState } from 'react';
import api from '../api/axiosConfig';

export default function LogActivity() {
  const [activeTab, setActiveTab] = useState('Transport');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('Car');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState('0.00');

  const categories = [
    { name: 'Transport', icon: '🚗', color: 'text-green-600 bg-green-50 border-green-200', types: ['Car', 'Flight', 'Public Transit'], unit: 'km' },
    { name: 'Electricity', icon: '⚡', color: 'text-blue-600 bg-blue-50 border-blue-200', types: ['Electricity Consumption'], unit: 'kWh' },
    { name: 'Food', icon: '🍽️', color: 'text-orange-600 bg-orange-50 border-orange-200', types: ['Beef Meal', 'Chicken/Pork Meal', 'Vegetarian Meal', 'Vegan Meal'], unit: 'servings' },
    { name: 'Shopping', icon: '🛍️', color: 'text-purple-600 bg-purple-50 border-purple-200', types: ['Clothing', 'Electronics', 'General Goods'], unit: 'USD' }
  ];

  const currentCategoryInfo = categories.find(c => c.name === activeTab);

  // Simple local estimation logic just for UI preview
  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setQuantity(val);
    if(val) {
        if(activeTab === 'Transport') setEstimate((parseFloat(val) * 0.192).toFixed(2));
        else if(activeTab === 'Electricity') setEstimate((parseFloat(val) * 0.4).toFixed(2));
        else if(activeTab === 'Food') setEstimate((parseFloat(val) * 2.5).toFixed(2));
        else setEstimate((parseFloat(val) * 0.1).toFixed(2));
    } else {
        setEstimate('0.00');
    }
  }

  const handleTabChange = (catName) => {
    setActiveTab(catName);
    setType(categories.find(c => c.name === catName).types[0]);
  }

  const handleLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/activities', {
        category: activeTab,
        activityType: type,
        quantity: parseFloat(quantity),
        unit: currentCategoryInfo.unit,
        logDate: logDate,
        memo: memo
      });
      alert('Activity successfully logged to database!');
      setQuantity('');
      setEstimate('0.00');
      setMemo('');
    } catch (err) {
      console.error(err);
      alert('Failed to log activity. Ensure emission factors exist in DB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Log New Activity</h1>
        <p className="text-gray-500 mt-1 font-medium">Record daily actions to calculate your real-time footprint.</p>
      </div>

      <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="lg:w-2/3 p-10 lg:p-12">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Select Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {categories.map(cat => {
              const isActive = activeTab === cat.name;
              return (
                <button type="button" key={cat.name} onClick={() => handleTabChange(cat.name)}
                  className={`py-6 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                    isActive ? `border-transparent ${cat.color} shadow-md transform -translate-y-1` : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                  }`}>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <span className={`font-semibold ${isActive ? 'text-gray-900' : ''}`}>{cat.name}</span>
                </button>
              )
            })}
          </div>

          <form onSubmit={handleLog} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Activity Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
                  {currentCategoryInfo.types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Quantity ({currentCategoryInfo.unit})</label>
                <input type="number" step="0.1" required placeholder="e.g. 20" value={quantity} onChange={handleQuantityChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Date</label>
                <input type="date" required value={logDate} onChange={e => setLogDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all text-gray-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Memo / Description</label>
                <input type="text" placeholder="e.g. Daily commute" value={memo} onChange={e => setMemo(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? 'Logging...' : 'Log Activity'}
            </button>
          </form>
        </div>

        <div className="lg:w-1/3 bg-gray-900 text-white p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 text-center mb-12">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl border border-white/10">🌍</div>
            <p className="text-green-400 text-sm font-bold uppercase tracking-widest mb-3">Estimated Impact</p>
            <div className="text-6xl font-extrabold tracking-tight">{estimate}</div>
            <div className="text-xl text-gray-400 mt-2 font-medium">kg CO₂e</div>
          </div>
        </div>
      </div>
    </div>
  );
}
