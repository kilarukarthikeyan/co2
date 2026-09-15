import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  BarChart3, 
  Trophy, 
  FileText, 
  Building2, 
  Lock, 
  LogOut, 
  Search, 
  Menu,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import api from '../api/axiosConfig';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await api.get('/admin/summary');
        if (res.data && res.data.totalUsers !== undefined) {
          setUserCount(res.data.totalUsers);
        }
      } catch (err) {
        console.error('Failed to load admin summary count', err);
      }
    };
    fetchUserCount();
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/users?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users, badge: userCount > 0 ? userCount : undefined },
        { name: 'Activity Monitoring', path: '/admin/activities', icon: Activity },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { name: 'Carbon Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
      ]
    },
    {
      title: 'PLATFORM',
      items: [
        { name: 'Organizations', path: '/admin/organizations', icon: Building2 },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-500/20">
              🌱
            </div>
            <div>
              <span className="font-extrabold text-gray-900 text-base tracking-tight flex items-center gap-1.5">
                CarbonTrack
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block -mt-1">
                Administration Portal
              </span>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 bg-gray-200/60 px-1.5 py-0.5 rounded">
              Ctrl K
            </span>
          </div>
        </form>

        {/* Right Status & Profile */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-medium text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>System operational</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
          </div>

          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-gray-900 leading-tight">Administrator</div>
              <div className="text-[10px] text-gray-400 font-medium leading-none">Platform Admin</div>
            </div>
            <button 
              onClick={handleSignOut}
              className="ml-2 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-all flex items-center gap-1"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} transition-all duration-300 ease-in-out bg-white border-r border-gray-200/80 flex flex-col justify-between overflow-y-auto shrink-0 fixed md:sticky top-16 h-[calc(100vh-4rem)] z-20`}>
          <div className="p-4 space-y-6">
            {menuSections.map((section, idx) => (
              <div key={idx}>
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-emerald-50/80 text-emerald-700 shadow-xs border border-emerald-100/80 font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            isActive ? 'bg-emerald-200/70 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom Security Info & Sign Out */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-amber-900">Protected workspace</div>
                <div className="text-[9px] text-amber-700/80 uppercase font-semibold tracking-wider">
                  Administrator Access
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}