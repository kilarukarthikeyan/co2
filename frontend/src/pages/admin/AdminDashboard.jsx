import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Globe2, Zap, TrendingUp, TrendingDown, 
  BarChart3, RotateCw, Search, ChevronRight, Trash2, Building2, FileSpreadsheet 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/axiosConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalUsers: 0, todayActivitiesCount: 0, totalActivitiesCount: 0,
    totalCo2e: 0, todayCo2e: 0, avgCo2ePerUser: 0,
    highestLifetimeEmitter: null, highestTodayEmitter: null, lowestFootprintUser: null
  });
  const [dailyEmissions, setDailyEmissions] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [topEcoUsers, setTopEcoUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('highest_carbon');
  const [selectedUserModal, setSelectedUserModal] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, dailyRes, catRes, ecoRes, usersRes] = await Promise.all([
        api.get('/admin/summary'),
        api.get('/admin/daily-emissions?days=30'),
        api.get('/admin/category-breakdown'),
        api.get('/admin/top-eco-users?limit=4'),
        api.get(`/admin/users?search=${encodeURIComponent(searchQuery)}&role=${roleFilter}&sortBy=${sortBy}`)
      ]);
      setSummary(sumRes.data || {});
      const formattedDaily = (dailyRes.data || []).map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        co2e: Number(item.co2e) || 0
      }));
      setDailyEmissions(formattedDaily);
      setCategoryBreakdown(catRes.data || []);
      setTopEcoUsers(ecoRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [roleFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}" and all their records?`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase mb-1">Administrator Overview</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Good afternoon, Administrator.</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Monitor your community's activity and carbon footprint from one central workspace.</p>
        </div>
        <button onClick={fetchDashboardData} className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all cursor-pointer self-start sm:self-auto">
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-500'}`} />
          <span>Refresh data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Users</div>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">{summary.totalUsers}</div>
          <div className="text-[11px] text-gray-500 font-medium">Registered accounts</div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-[11px] font-bold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>Active platform
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Today's Activities</div>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-1">{summary.todayActivitiesCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Activities recorded today</div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">{summary.totalActivitiesCount} total</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Total CO₂</div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold"><Globe2 className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline text-gray-900 mb-1">
            <span className="text-3xl font-extrabold">{Number(summary.totalCo2e || 0).toFixed(2)}</span>
            <span className="ml-1.5 text-xs font-bold text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium">Platform carbon footprint</div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">Lifetime recorded impact</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Today's CO₂</div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><Zap className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline text-gray-900 mb-1">
            <span className="text-3xl font-extrabold">{Number(summary.todayCo2e || 0).toFixed(2)}</span>
            <span className="ml-1.5 text-xs font-bold text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium">Carbon generated today</div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-bold text-gray-500">Avg: {Number(summary.avgCo2ePerUser || 0).toFixed(2)} kg / user</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Highest lifetime emitter</div>
            <div className="text-xs font-bold text-gray-900 truncate">{summary.highestLifetimeEmitter ? summary.highestLifetimeEmitter.name : 'None'}</div>
            <div className="text-[11px] font-semibold text-rose-600">{summary.highestLifetimeEmitter ? `${Number(summary.highestLifetimeEmitter.co2e).toFixed(2)} kg CO₂e` : '0 kg'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Zap className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Highest emitter today</div>
            <div className="text-xs font-bold text-gray-900 truncate">{summary.highestTodayEmitter ? summary.highestTodayEmitter.name : 'None'}</div>
            <div className="text-[11px] font-semibold text-amber-600">{summary.highestTodayEmitter ? `${Number(summary.highestTodayEmitter.co2e).toFixed(2)} kg CO₂e today` : '0 kg'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><TrendingDown className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Lowest footprint</div>
            <div className="text-xs font-bold text-gray-900 truncate">{summary.lowestFootprintUser ? summary.lowestFootprintUser.name : 'None'}</div>
            <div className="text-[11px] font-semibold text-emerald-600">{summary.lowestFootprintUser ? `${Number(summary.lowestFootprintUser.co2e).toFixed(2)} kg CO₂e total` : '0 kg'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><BarChart3 className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Average Footprint</div>
            <div className="text-xs font-bold text-gray-900 truncate">{Number(summary.avgCo2ePerUser || 0).toFixed(2)} kg</div>
            <div className="text-[11px] font-medium text-gray-400">Per registered user</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Carbon Analytics</div>
              <h3 className="text-base font-bold text-gray-900">Daily Carbon Emissions</h3>
              <p className="text-xs text-gray-400 mt-0.5">Platform-wide CO₂ generated during the last 30 days.</p>
            </div>
            <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600">30 DAYS</div>
          </div>
          <div className="h-64 w-full">
            {dailyEmissions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyEmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} formatter={(val) => [`${Number(val).toFixed(2)} kg CO₂e`, 'Emissions']} />
                  <Line type="monotone" dataKey="co2e" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 2 }} activeDot={{ r: 5, strokeWidth: 0, fill: '#4338ca' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">No activity data recorded in the last 30 days.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Breakdown</div>
            <h3 className="text-base font-bold text-gray-900">Emissions by Category</h3>
            <p className="text-xs text-gray-400 mt-0.5 mb-5">Actual platform carbon contribution by activity.</p>
            <div className="space-y-4">
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((cat, idx) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-gray-400 w-4">{idx + 1}</span>
                        <span className="font-bold text-gray-800 uppercase tracking-wide text-[11px]">{cat.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 font-medium text-[11px]">{Number(cat.totalCo2e).toFixed(2)} kg CO₂e</span>
                        <span className="font-bold text-gray-900 text-[11px] w-12 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(2, cat.percentage))}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-gray-400">No category emissions logged yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Community Performance</div>
            <h3 className="text-base font-bold text-gray-900">Top Eco-Friendly Users</h3>
            <p className="text-xs text-gray-400">Users with the lowest recorded carbon footprint.</p>
          </div>
          <button onClick={() => navigate('/admin/users')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            <span>View all users</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topEcoUsers.length > 0 ? (
            topEcoUsers.map((user, idx) => (
              <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-gray-400 w-3">{idx + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-xs">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{user.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{user.activityCount} activities</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-600">{Number(user.totalCo2e).toFixed(2)} kg</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-6 bg-white rounded-xl border border-gray-100 text-center text-xs text-gray-400">No registered user activity yet.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Community Management</div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>User Management</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full">{users.length}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Monitor users, carbon emissions, activities and account status.</p>
            </div>
            <div className="text-xs text-gray-400 font-medium self-start sm:self-auto">Showing {users.length} users</div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer">
                <option value="ALL">All roles</option>
                <option value="USER">User</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="ADMIN">Admin</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer">
                <option value="ALL">All status</option>
                <option value="ACTIVE">Active</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none cursor-pointer">
                <option value="highest_carbon">Highest carbon</option>
                <option value="lowest_carbon">Lowest carbon</option>
                <option value="most_activities">Most activities</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Activities</th>
                  <th className="p-4 text-right">Total CO₂</th>
                  <th className="p-4 text-right">Today</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-[11px] text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'ORGANIZATION' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-700">{u.activityCount}</td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-gray-900">{Number(u.totalCo2e).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400 ml-1">kg CO₂e</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-gray-700">{Number(u.todayCo2e).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400 ml-1">kg today</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button onClick={() => setSelectedUserModal(u)} className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 cursor-pointer">
                        View
                      </button>
                      <button onClick={() => handleDeleteUser(u.id, u.name)} className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">No users matching the current filter.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div onClick={() => navigate('/admin/activities')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activity Monitoring</span>
            <Activity className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{summary.totalActivitiesCount}</div>
          <p className="text-xs text-gray-400">Total activities recorded across the CarbonTrack platform.</p>
        </div>

        <div onClick={() => navigate('/admin/reports')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Platform Reports</span>
            <FileSpreadsheet className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">{Number(summary.totalCo2e || 0).toFixed(2)} kg</div>
          <p className="text-xs text-gray-400">Total recorded carbon footprint available for reporting and analysis.</p>
        </div>

        <div onClick={() => navigate('/admin/organizations')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Organizations</span>
            <Building2 className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-1">0</div>
          <p className="text-xs text-gray-400">Organization management workspace.</p>
        </div>
      </div>

      {selectedUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-base font-bold text-gray-900">User Profile Telemetry</h4>
              <button onClick={() => setSelectedUserModal(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">User ID:</span><span className="font-bold text-gray-900">USR-{selectedUserModal.id}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Full Name:</span><span className="font-bold text-gray-900">{selectedUserModal.name}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Email:</span><span className="font-bold text-gray-900">{selectedUserModal.email}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Role:</span><span className="font-bold text-indigo-600">{selectedUserModal.role}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Total Activities Logged:</span><span className="font-bold text-gray-900">{selectedUserModal.activityCount}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Lifetime Total CO₂e:</span><span className="font-bold text-emerald-600">{Number(selectedUserModal.totalCo2e).toFixed(2)} kg</span></div>
              <div className="flex justify-between py-1.5"><span className="text-gray-400 font-medium">Today's CO₂e:</span><span className="font-bold text-amber-600">{Number(selectedUserModal.todayCo2e).toFixed(2)} kg</span></div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedUserModal(null)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}