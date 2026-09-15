import { Bell, Search, ChevronDown } from 'lucide-react';
export default function Navbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-20">
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-6">
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input type="text" placeholder="Quick search..." className="pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 transition-all w-64" />
        </div>
        
        <button className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors bg-gray-50 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center pl-6 border-l border-gray-200 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
            U
          </div>
          <div className="ml-3 flex items-center">
            <span className="text-sm font-semibold text-gray-700">My Account</span>
            <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
