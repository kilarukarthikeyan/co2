import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { 
  Plus, Calendar, ChevronLeft, ChevronRight, Clock, 
  TrendingUp, Award, Layers, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw 
} from 'lucide-react';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const navigate = useNavigate();

  // Filter modes: 'DAY' | 'WEEK' | 'MONTH' | 'CUSTOM'
  const [filterMode, setFilterMode] = useState('DAY');
  
  // Date states (defaulting to current date)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr); // for DAY mode
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  
  // Data States
  const [periodSummary, setPeriodSummary] = useState({
    periodTotalCo2e: 0,
    dailyAverage: 0,
    logCount: 0,
    peerPercentile: 100,
    topCategory: 'None',
    topCategoryCo2e: 0
  });
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date range based on mode
  const computeDateRange = (mode, baseDate) => {
    const d = new Date(baseDate);
    if (mode === 'DAY') {
      return { start: baseDate, end: baseDate };
    } else if (mode === 'WEEK') {
      // Find Monday of the week
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(d.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return {
        start: monday.toISOString().split('T')[0],
        end: sunday.toISOString().split('T')[0]
      };
    } else if (mode === 'MONTH') {
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return {
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0]
      };
    }
    return { start: startDate, end: endDate };
  };

  // Update dates when filterMode or selectedDate changes
  useEffect(() => {
    if (filterMode !== 'CUSTOM') {
      const range = computeDateRange(filterMode, selectedDate);
      setStartDate(range.start);
      setEndDate(range.end);
    }
  }, [filterMode, selectedDate]);

  // Fetch all filtered data whenever startDate or endDate changes
  const fetchFilteredAnalytics = async () => {
    setLoading(true);
    try {
      const params = { startDate, endDate };
      const [sumRes, catRes, trendRes, logsRes, tipsRes] = await Promise.all([
        api.get('/analytics/period-summary', { params }),
        api.get('/analytics/categories', { params }),
        api.get('/analytics/trend', { params }),
        api.get('/activities', { params }),
        api.get('/analytics/recommendations')
      ]);

      setPeriodSummary(sumRes.data);

      const formattedCats = catRes.data.map(item => ({
        name: item[0],
        value: item[1] || 0
      })).filter(c => c.value > 0);
      setCategories(formattedCats);

      setTrendData(trendRes.data);
      setFilteredLogs(logsRes.data);
      setTips(tipsRes.data);
    } catch (err) {
      console.error('Failed to load period analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchFilteredAnalytics();
    }
  }, [startDate, endDate]);

  // Navigation handlers
  const handlePrevious = () => {
    const d = new Date(selectedDate);
    if (filterMode === 'DAY') {
      d.setDate(d.getDate() - 1);
    } else if (filterMode === 'WEEK') {
      d.setDate(d.getDate() - 7);
    } else if (filterMode === 'MONTH') {
      d.setMonth(d.getMonth() - 1);
    }
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (filterMode === 'DAY') {
      d.setDate(d.getDate() + 1);
    } else if (filterMode === 'WEEK') {
      d.setDate(d.getDate() + 7);
    } else if (filterMode === 'MONTH') {
      d.setMonth(d.getMonth() + 1);
    }
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    setSelectedDate(todayStr);
  };

  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#8b5cf6'];
  const pieData = categories.length > 0 ? categories : [{ name: 'No Activity', value: 1 }];

  // Label for period view banner
  const getPeriodLabel = () => {
    if (filterMode === 'DAY') {
      return `Day View — ${startDate === todayStr ? 'Today, ' : ''}${new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    } else if (filterMode === 'WEEK') {
      return `Week View — ${new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to ${new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (filterMode === 'MONTH') {
      return `Month View — ${new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else {
      return `Custom Range — ${startDate} to ${endDate}`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Granular time-based carbon footprint breakdown & performance metrics.</p>
        </div>
        <button 
          onClick={() => navigate('/log-activity')} 
          className="flex items-center px-6 py-3.5 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 self-start md:self-auto"
        >
          <Plus className="w-5 h-5 mr-2" /> Log Activity
        </button>
      </div>

      {/* Time-Based Filter Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 self-start">
            {[
              { id: 'DAY', label: 'Day-wise' },
              { id: 'WEEK', label: 'Week-wise' },
              { id: 'MONTH', label: 'Month-wise' },
              { id: 'CUSTOM', label: 'Custom Range' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  filterMode === tab.id
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Date Range Selectors & Controls */}
          {filterMode !== 'CUSTOM' ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevious} 
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 transition-colors"
                title="Previous Period"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {filterMode === 'DAY' && (
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)} 
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all cursor-pointer"
                />
              )}

              {filterMode === 'WEEK' && (
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span>{new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}

              {filterMode === 'MONTH' && (
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span>{new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}

              <button 
                onClick={handleNext} 
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 transition-colors"
                title="Next Period"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button 
                onClick={handleSetToday} 
                className="px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Today
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">From:</span>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">To:</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button 
                onClick={fetchFilteredAnalytics}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Apply
              </button>
            </div>
          )}
        </div>

        {/* Current Filter Indicator Banner */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs font-medium text-gray-500">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            <span className="font-semibold text-gray-900 mr-1.5">Active Scope:</span> {getPeriodLabel()}
          </div>
          <div>
            Total logs in this period: <span className="font-bold text-gray-900">{periodSummary.logCount} entries</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
          Refreshing time-filtered analytics...
        </div>
      ) : (
        <>
          {/* Metric KPI Cards for Selected Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl bg-blue-50 text-blue-600">🌍</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                {filterMode === 'DAY' ? "Day's Footprint" : 'Period Footprint'}
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-extrabold text-gray-900">{periodSummary.periodTotalCo2e.toFixed(2)}</h2>
                <span className="ml-2 text-gray-500 font-medium text-sm">kg CO₂e</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl bg-purple-50 text-purple-600">📊</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Daily Average</p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-extrabold text-gray-900">{periodSummary.dailyAverage.toFixed(2)}</h2>
                <span className="ml-2 text-gray-500 font-medium text-sm">kg/day</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl bg-emerald-50 text-emerald-600">⚡</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Top Emission Source</p>
              <div className="flex items-baseline">
                <h2 className="text-2xl font-extrabold text-gray-900">{periodSummary.topCategory}</h2>
              </div>
              <p className="text-xs text-gray-400 font-semibold mt-1">{periodSummary.topCategoryCo2e.toFixed(1)} kg CO₂e emitted</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl bg-amber-50 text-amber-600">🏆</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Peer Benchmark</p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-extrabold text-gray-900">Top {periodSummary.peerPercentile.toFixed(0)}%</h2>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-1">Relative standing in period</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart (Dynamic for period) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Emissions Timeline</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Day-by-day progression within the selected period</p>
                </div>
              </div>
              
              <div className="h-80">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                        formatter={(val) => [`${Number(val).toFixed(2)} kg CO₂e`, 'Emissions']}
                      />
                      <Area type="monotone" dataKey="co2e" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No trend data available for this range.
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown for Period */}
            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Category Breakdown</h3>
              <p className="text-xs text-gray-400 font-medium mb-6">Distribution for the active period</p>
              
              <div className="flex-1 min-h-[220px]">
                {categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={65} 
                        outerRadius={95} 
                        paddingAngle={5} 
                        dataKey="value" 
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(val) => [`${Number(val).toFixed(2)} kg CO₂e`, 'Footprint']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
                    <span>No emissions recorded for this period.</span>
                  </div>
                )}
              </div>

              {categories.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                  {categories.map((entry, index) => (
                    <div key={entry.name} className="flex items-center text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>{entry.name}: {Number(entry.value).toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Logs Filtered Strictly for Period & Personalized Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Activity Logs for Period</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Showing {filteredLogs.length} activity entries</p>
                </div>
                <button 
                  onClick={() => navigate('/activity-history')} 
                  className="text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  Full History &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                {filteredLogs.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">
                    No activities were logged during this period.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                        <th className="p-5">Category</th>
                        <th className="p-5">Activity Details</th>
                        <th className="p-5">Date</th>
                        <th className="p-5 text-right">CO₂e (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-5 text-sm font-semibold text-gray-900">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              log.category === 'Transport' ? 'bg-green-100 text-green-700' :
                              log.category === 'Food' ? 'bg-orange-100 text-orange-700' :
                              log.category === 'Electricity' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {log.category}
                            </span>
                          </td>
                          <td className="p-5 text-sm text-gray-700 font-medium">
                            {log.activityType} ({log.quantity} {log.unit})
                            {log.memo && <span className="block text-xs text-gray-400 mt-0.5">{log.memo}</span>}
                          </td>
                          <td className="p-5 text-sm text-gray-500">{log.logDate}</td>
                          <td className="p-5 text-sm font-bold text-gray-900 text-right">{log.calculatedCo2e.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Insights</h3>
              <p className="text-xs text-gray-400 mb-6 font-medium">Tailored recommendations based on your highest emissions</p>
              
              <ul className="space-y-4">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start p-4 bg-green-50/40 rounded-2xl border border-green-100/60">
                    <span className="text-2xl mr-3">💡</span>
                    <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">{tip}</p>
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
