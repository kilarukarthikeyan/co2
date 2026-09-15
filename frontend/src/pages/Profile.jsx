import { User, Settings, Shield, Bell } from 'lucide-react';

export default function Profile() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar settings nav */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Public Profile', active: true },
            { icon: Shield, label: 'Security & Password', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Settings, label: 'Preferences', active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center px-5 py-4 rounded-2xl font-semibold transition-all ${
              item.active ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] text-green-700 border border-green-100' : 'text-gray-500 hover:bg-white hover:shadow-sm'
            }`}>
              <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-5 py-4 rounded-2xl font-semibold text-red-500 hover:bg-red-50 mt-8 transition-colors">
            Logout from all devices
          </button>
        </div>

        {/* Form area */}
        <div className="md:col-span-2 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          <div className="flex items-center mb-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-green-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl shadow-lg shadow-green-200">
              U
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload new avatar</h2>
              <p className="text-gray-500 text-sm mt-1 mb-4">Recommended size 256x256px</p>
              <div className="flex space-x-3">
                <button className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">Choose File</button>
                <button className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">Remove</button>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">First Name</label>
                <input type="text" defaultValue="Demo" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Last Name</label>
                <input type="text" defaultValue="User" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input type="email" defaultValue="demo@ecotrack.com" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all text-gray-500" readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Bio</label>
              <textarea rows="4" placeholder="Share your sustainability journey..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
