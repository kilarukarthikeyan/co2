import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, RotateCw } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('highest_carbon');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?search=${encodeURIComponent(searchQuery)}&role=${roleFilter}&sortBy=${sortBy}`);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}" and all their records?`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Manage and audit registered user accounts and their carbon emissions.</p>
        </div>
        <button onClick={fetchUsers} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all flex items-center gap-2 self-start cursor-pointer">
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-3 justify-between">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </form>
          <div className="flex items-center gap-2">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 cursor-pointer">
              <option value="ALL">All roles</option>
              <option value="USER">User</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 cursor-pointer">
              <option value="highest_carbon">Highest carbon</option>
              <option value="lowest_carbon">Lowest carbon</option>
              <option value="most_activities">Most activities</option>
              <option value="name">Name</option>
            </select>
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
                    <td className="p-4 text-right font-bold text-gray-900">{Number(u.totalCo2e).toFixed(2)} kg</td>
                    <td className="p-4 text-right font-semibold text-gray-700">{Number(u.todayCo2e).toFixed(2)} kg</td>
                    <td className="p-4 text-center text-emerald-600 font-bold text-[11px]">ACTIVE</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button onClick={() => setSelectedUser(u)} className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-lg cursor-pointer">View</button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">No users found.</div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-base font-bold text-gray-900">User Telemetry: {selectedUser.name}</h4>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">User ID:</span><span className="font-bold text-gray-900">USR-{selectedUser.id}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Email:</span><span className="font-bold text-gray-900">{selectedUser.email}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Role:</span><span className="font-bold text-indigo-600">{selectedUser.role}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Activity Count:</span><span className="font-bold text-gray-900">{selectedUser.activityCount}</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-50"><span className="text-gray-400 font-medium">Total CO₂e:</span><span className="font-bold text-emerald-600">{Number(selectedUser.totalCo2e).toFixed(2)} kg</span></div>
              <div className="flex justify-between py-1.5"><span className="text-gray-400 font-medium">Today's CO₂e:</span><span className="font-bold text-amber-600">{Number(selectedUser.todayCo2e).toFixed(2)} kg</span></div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}