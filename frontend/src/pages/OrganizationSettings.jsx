import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import api from '../api/axiosConfig';

export default function OrganizationSettings() {
  const [org, setOrg] = useState({ name: '', description: '', joinToken: '', sustainabilityTarget: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await api.get('/organization/settings');
        setOrg(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/organization/settings', org);
      setOrg(res.data);
      alert('Organization settings updated!');
    } catch(err) {
      console.error(err);
      alert('Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Organization Profile</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage company defaults, target sustainability limits, and tokens.</p>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading settings...</p>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Organization Name</label>
              <input 
                type="text" 
                value={org.name} 
                onChange={e => setOrg({...org, name: e.target.value})} 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                rows="4" 
                value={org.description || ''} 
                onChange={e => setOrg({...org, description: e.target.value})} 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Sustainability Limit (Tons CO₂e/mo)</label>
                <input 
                  type="number" 
                  value={org.sustainabilityTarget || 0} 
                  onChange={e => setOrg({...org, sustainabilityTarget: parseFloat(e.target.value)})} 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Employee Join Token</label>
                <input 
                  type="text" 
                  value={org.joinToken || ''} 
                  onChange={e => setOrg({...org, joinToken: e.target.value})} 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all font-mono" 
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving} 
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
