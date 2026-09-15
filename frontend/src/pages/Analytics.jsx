import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Target, AlertCircle } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Analytics() {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState({ todayCo2e: 0, weeklyCo2e: 0, monthlyCo2e: 0, previousWeeklyCo2e: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, summaryRes, categoriesRes] = await Promise.all([
          api.get('/activities'),
          api.get('/analytics/summary'),
          api.get('/analytics/categories')
        ]);

        setActivities(activitiesRes.data || []);
        setSummary(summaryRes.data || {});
        
        // Format categories for pie chart
        const formattedCats = (categoriesRes.data || []).map(item => ({
          name: item[0],
          value: parseFloat(item[1]) || 0
        })).filter(c => c.value > 0);
        
        setCategories(formattedCats);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load analytics data', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate daily trend data from activities
  const generateDailyTrends = () => {
    if (activities.length === 0) return [];
    
    const trendMap = {};
    activities.forEach(activity => {
      const date = activity.logDate;
      if (!trendMap[date]) {
        trendMap[date] = 0;
      }
      trendMap[date] += activity.calculatedCo2e || 0;
    });

    return Object.entries(trendMap)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, co2e]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        co2e: parseFloat(co2e.toFixed(2))
      }))
      .slice(-30); // Last 30 days
  };

  // Activity count by category
  const generateCategoryActivityCount = () => {
    const countMap = {};
    activities.forEach(activity => {
      const category = activity.category;
      if (!countMap[category]) {
        countMap[category] = 0;
      }
      countMap[category]++;
    });

    return Object.entries(countMap)
      .map(([category, count]) => ({
        category,
        activities: count
      }));
  };

  // Total CO2e by activity type
  const generateActivityTypeCo2e = () => {
    const typeMap = {};
    activities.forEach(activity => {
      const type = activity.activityType;
      if (!typeMap[type]) {
        typeMap[type] = 0;
      }
      typeMap[type] += activity.calculatedCo2e || 0;
    });

    return Object.entries(typeMap)
      .map(([type, co2e]) => ({
        type,
        co2e: parseFloat(co2e.toFixed(2))
      }))
      .sort((a, b) => b.co2e - a.co2e)
      .slice(0, 8);
  };

  // Weekly comparison (current vs previous)
  const generateWeeklyComparison = () => {
    const currentWeekPercentage = summary.previousWeeklyCo2e 
      ? (((summary.weeklyCo2e - summary.previousWeeklyCo2e) / summary.previousWeeklyCo2e) * 100).toFixed(1)
      : 0;

    return [
      { week: 'Previous Week', co2e: summary.previousWeeklyCo2e || 0 },
      { week: 'Current Week', co2e: summary.weeklyCo2e || 0 }
    ];
  };

  // Category-wise stats
  const generateCategoryStats = () => {
    return categories.map(cat => {
      const categoryActivities = activities.filter(a => a.category === cat.name);
      return {
        category: cat.name,
        totalCo2e: cat.value,
        activityCount: categoryActivities.length,
        avgPerActivity: categoryActivities.length > 0 ? (cat.value / categoryActivities.length).toFixed(2) : 0
      };
    });
  };

  const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#8b5cf6', '#d946ef', '#f97316'];
  const dailyTrends = generateDailyTrends();
  const categoryActivityCount = generateCategoryActivityCount();
  const activityTypeCo2e = generateActivityTypeCo2e();
  const weeklyComparison = generateWeeklyComparison();
  const categoryStats = generateCategoryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-500 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics & Insights</h1>
        <p className="text-gray-500 mt-1 font-medium">Comprehensive view of your carbon footprint tracking</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Emissions", value: summary.todayCo2e?.toFixed(2) || '0.00', unit: 'kg CO₂e', icon: '🌍', color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: "Weekly Total", value: summary.weeklyCo2e?.toFixed(2) || '0.00', unit: 'kg CO₂e', icon: '📅', color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: "Monthly Total", value: summary.monthlyCo2e?.toFixed(2) || '0.00', unit: 'kg CO₂e', icon: '🎯', color: 'text-green-600', bg: 'bg-green-50' },
          { title: "Total Activities", value: activities.length, unit: 'logged', icon: '📊', color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center text-2xl`}>{stat.icon}</div>
            </div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
            <div className="flex items-baseline">
              <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
              <span className="ml-2 text-gray-500 text-sm font-medium">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Trend */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Daily Emissions Trend</h3>
          </div>
          {dailyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="co2e" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No activity data available</div>
          )}
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Carbon by Category</h3>
          {categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categories} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(1)}kg`} outerRadius={100} fill="#16a34a" dataKey="value">
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No category data</div>
          )}
        </div>

        {/* Activity Count by Category */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Activities by Category</h3>
          {categoryActivityCount.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryActivityCount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                <Bar dataKey="activities" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No activity data</div>
          )}
        </div>

        {/* Top Activity Types */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Emission Sources</h3>
          {activityTypeCo2e.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityTypeCo2e} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis dataKey="type" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                <Bar dataKey="co2e" fill="#ea580c" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No data available</div>
          )}
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Weekly Comparison</h3>
            <div className={`text-sm font-bold ${summary.weeklyCo2e > summary.previousWeeklyCo2e ? 'text-red-600' : 'text-green-600'}`}>
              {summary.weeklyCo2e > summary.previousWeeklyCo2e ? '↑' : '↓'} 
              {Math.abs(((summary.weeklyCo2e - summary.previousWeeklyCo2e) / (summary.previousWeeklyCo2e || 1)) * 100).toFixed(1)}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
              <Bar dataKey="co2e" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Stats Table */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Category Statistics</h3>
          {categoryStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total CO₂e</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg/Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map((stat, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{stat.category}</td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-900">{stat.totalCo2e.toFixed(2)} kg</td>
                      <td className="text-right py-3 px-4 text-gray-600">{stat.activityCount}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{stat.avgPerActivity} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">No category data available</div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h3>
        {activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                {activities.slice(0, 10).map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600">{activity.logDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activity.category === 'Transport' ? 'bg-green-100 text-green-700' :
                        activity.category === 'Food' ? 'bg-orange-100 text-orange-700' :
                        activity.category === 'Electricity' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {activity.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{activity.activityType}</td>
                    <td className="py-3 px-4 text-gray-600">{activity.quantity} {activity.unit}</td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-900">{activity.calculatedCo2e?.toFixed(2) || '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">No activities yet. Start logging to see analytics!</div>
        )}
      </div>
    </div>
  );
}
