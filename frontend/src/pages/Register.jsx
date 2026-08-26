import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      
      <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-2xl border border-white/50 max-w-md w-full relative z-10">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner mx-auto">✨</div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Create Account</h2>
        <p className="text-gray-500 mb-10 text-center">Join us in making the Earth greener.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all" />
          
          <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required 
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all" />
          
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required 
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all" />
          
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} 
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all appearance-none cursor-pointer">
            <option value="USER">Personal Account</option>
            <option value="ORGANIZATION">Organization Account</option>
          </select>
          
          <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 active:scale-[0.98] transition-all mt-4">
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700 ml-1 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
