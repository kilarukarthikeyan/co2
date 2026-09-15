import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@carbontrack.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userName', 'Administrator');
        
        if (res.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          setError('Account does not have administrator privileges.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Invalid admin credentials. Please use the default administrator account.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultAdmin = () => {
    setEmail('admin@carbontrack.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-xl shadow-emerald-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            CarbonTrack Administration
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Platform governance, telemetry & carbon monitoring workspace
          </p>
        </div>

        {/* Credentials Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Quick Credential Hint Banner */}
          <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-emerald-300">Default Admin Credentials</div>
                <div className="text-[10px] text-slate-400 font-mono">admin@carbontrack.com / admin123</div>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDefaultAdmin}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 bg-emerald-900/50 hover:bg-emerald-900/80 rounded-md border border-emerald-700/50 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@carbontrack.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              &larr; Switch to Standard User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}