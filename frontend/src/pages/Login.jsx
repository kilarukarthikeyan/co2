import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate(res.data.role === 'ORGANIZATION' ? '/organization' : '/dashboard');
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="flex bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full border border-white/50 relative z-10 min-h-[600px]">
        {/* Left Side Branding */}
        <div className="w-1/2 p-12 relative overflow-hidden flex flex-col justify-center items-center text-center bg-green-600">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-black/20 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mb-8 flex items-center justify-center text-7xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">🌍</div>
            <h1 className="text-4xl font-extrabold mb-4 text-white tracking-tight">EcoTrack</h1>
            <p className="text-green-50 mb-10 text-lg leading-relaxed max-w-sm">Master your carbon footprint. Build sustainable habits. Preserve the planet for tomorrow.</p>
            <div className="px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg flex items-center gap-2">
              <span>🌱</span> Sustainable Lifestyle
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-1/2 p-16 flex flex-col justify-center bg-white">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">👋</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-10 text-lg">Sign in to continue your green journey.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" placeholder="meena@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">Forgot Password?</a>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all" />
            </div>
            
            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 active:scale-[0.98] transition-all mt-4">
              Sign In
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              New here? <Link to="/register" className="text-green-600 hover:text-green-700 ml-1 hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
