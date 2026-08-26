import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Target, Trophy, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem('role') || 'USER';

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Activity', path: '/log-activity', icon: PlusCircle },
    { name: 'Activity History', path: '/activity-history', icon: History },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const orgLinks = [
    { name: 'Org Dashboard', path: '/organization', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const links = role === 'ORGANIZATION' ? orgLinks : userLinks;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-8 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-green-200">🌍</div>
        <span className="ml-3 font-bold text-xl text-gray-800 tracking-tight">EcoTrack</span>
      </div>
      
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-green-50 text-green-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <link.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-6 border-t border-gray-50">
        <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-medium group">
          <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}
