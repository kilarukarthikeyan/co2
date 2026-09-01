import { useState, useEffect } from 'react';
import { User, Shield, Bell, Settings } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: '',
    sustainabilityPreferences: '',
    emailAlerts: true,
    goalReminders: true,
    weeklySummaries: true,
    preferredTravelType: 'Car',
    dietType: 'Vegetarian Meal'
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(prev => ({
          ...prev,
          ...res.data,
          emailAlerts: res.data.emailAlerts !== null ? res.data.emailAlerts : true,
          goalReminders: res.data.goalReminders !== null ? res.data.goalReminders : true,
          weeklySummaries: res.data.weeklySummaries !== null ? res.data.weeklySummaries : true,
          preferredTravelType: res.data.preferredTravelType || 'Car',
          dietType: res.data.dietType || 'Vegetarian Meal'
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', {
        name: profile.name,
        bio: profile.bio,
        profileImage: profile.profileImage,
        sustainabilityPreferences: profile.sustainabilityPreferences
      });
      setProfile(prev => ({ ...prev, ...res.data }));
      alert('Profile updated successfully!');
    } catch(err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', {
        emailAlerts: profile.emailAlerts,
        goalReminders: profile.goalReminders,
        weeklySummaries: profile.weeklySummaries
      });
      setProfile(prev => ({ ...prev, ...res.data }));
      alert('Notification preferences updated successfully!');
    } catch(err) {
      console.error(err);
      alert('Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', {
        preferredTravelType: profile.preferredTravelType,
        dietType: profile.dietType
      });
      setProfile(prev => ({ ...prev, ...res.data }));
      alert('Travel and diet preferences updated successfully!');
    } catch(err) {
      console.error(err);
      alert('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmNewPassword) {
      alert('Please fill in all password fields.');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/profile/password', passwordState);
      alert('Password updated successfully!');
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch(err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to update password';
      alert(errMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Account Settings</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading profile...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            {[
              { id: 'profile', icon: User, label: 'Public Profile' },
              { id: 'security', icon: Shield, label: 'Security & Password' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
              { id: 'preferences', icon: Settings, label: 'Preferences' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-5 py-4 rounded-2xl font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] text-green-700 border border-green-100'
                    : 'text-gray-500 hover:bg-white hover:shadow-sm'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-green-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center px-5 py-4 rounded-2xl font-semibold text-red-500 hover:bg-red-50 mt-8 transition-colors">
              Logout
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center mb-10">
                  <div className="w-24 h-24 rounded-3xl bg-gray-100 border flex items-center justify-center text-white font-bold text-4xl shadow-md overflow-hidden">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">U</span>
                    )}
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">Upload new avatar</h2>
                    <p className="text-gray-500 text-sm mt-1 mb-4">Formats: JPEG, PNG. Stores in DB.</p>
                    <div className="flex space-x-3">
                      <label className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
                        Choose File
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <button type="button" onClick={() => setProfile(prev => ({...prev, profileImage: ''}))} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Display Name</label>
                    <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address (Read Only)</label>
                    <input type="email" value={profile.email || ''} readOnly className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-400 cursor-not-allowed outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Bio</label>
                    <textarea rows="4" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Share your sustainability journey..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sustainability Preference Target (kg CO₂e/day)</label>
                    <input type="text" value={profile.sustainabilityPreferences || ''} onChange={e => setProfile({...profile, sustainabilityPreferences: e.target.value})} placeholder="e.g. 10.0" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Password</h2>
                <p className="text-gray-500 text-sm mb-8">Update your password to keep your account secure.</p>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={passwordState.currentPassword}
                      onChange={e => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={passwordState.newPassword}
                      onChange={e => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordState.confirmNewPassword}
                      onChange={e => setPasswordState({ ...passwordState, confirmNewPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={savingPassword} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
                <p className="text-gray-500 text-sm mb-8">Choose how and when you receive updates and reminders.</p>

                <form onSubmit={handleSaveNotifications} className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col pr-4">
                        <span className="font-semibold text-gray-900">Email Alerts</span>
                        <span className="text-gray-500 text-sm">Receive email alerts for important updates and account activities.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, emailAlerts: !prev.emailAlerts }))}
                        className={`${
                          profile.emailAlerts ? 'bg-green-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            profile.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <div className="flex flex-col pr-4">
                        <span className="font-semibold text-gray-900">Goal Reminders</span>
                        <span className="text-gray-500 text-sm">Get notifications when your goals are close to expiring or need attention.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, goalReminders: !prev.goalReminders }))}
                        className={`${
                          profile.goalReminders ? 'bg-green-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            profile.goalReminders ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <div className="flex flex-col pr-4">
                        <span className="font-semibold text-gray-900">Weekly Summaries</span>
                        <span className="text-gray-500 text-sm">Receive weekly reports on your sustainability progress and activities.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, weeklySummaries: !prev.weeklySummaries }))}
                        className={`${
                          profile.weeklySummaries ? 'bg-green-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            profile.weeklySummaries ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sustainability Preferences</h2>
                <p className="text-gray-500 text-sm mb-8">Personalize your default options for tracking emissions.</p>

                <form onSubmit={handleSavePreferences} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Preferred Travel Type</label>
                    <div className="relative">
                      <select
                        value={profile.preferredTravelType}
                        onChange={e => setProfile({...profile, preferredTravelType: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
                      >
                        <option value="Car">Car</option>
                        <option value="Public Transit">Public Transit</option>
                        <option value="Flight">Flight</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Diet Type</label>
                    <div className="relative">
                      <select
                        value={profile.dietType}
                        onChange={e => setProfile({...profile, dietType: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
                      >
                        <option value="Beef Meal">Beef Meal</option>
                        <option value="Chicken/Pork Meal">Chicken/Pork Meal</option>
                        <option value="Vegetarian Meal">Vegetarian Meal</option>
                        <option value="Vegan Meal">Vegan Meal</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
