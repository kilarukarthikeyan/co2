import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import api from '../api/axiosConfig';

export default function OrganizationEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/organization/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employee list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/organization/employees', { name, email, password, department });
      alert('Employee successfully registered under organization!');
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setDepartment('Engineering');
      fetchEmployees();
    } catch(err) {
      console.error(err);
      alert(err.response?.data || 'Failed to register employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Employee CSR Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Detailed carbon emission comparisons across registered employees.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 transition-all w-full shadow-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading reports...</p>
          ) : filteredEmployees.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No employees match your search.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-6">Employee Name</th>
                  <th className="p-6">Email Address</th>
                  <th className="p-6 text-center">Activities Logged</th>
                  <th className="p-6 text-right">Total Footprint (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 font-bold text-gray-900">{emp.name}</td>
                    <td className="p-6 font-medium text-gray-500">{emp.email}</td>
                    <td className="p-6 text-center font-semibold text-gray-600">{emp.logCount}</td>
                    <td className="p-6 text-right font-extrabold text-gray-900">{emp.totalCo2e.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Register Employee</h3>
            <p className="text-gray-500 text-sm mb-6">Create a standard employee account under your organization.</p>
            
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Employee Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="employee@ecotrack.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Department</label>
                <select 
                  value={department} 
                  onChange={e => setDepartment(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-500 font-medium transition-all appearance-none cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 mt-4"
              >
                {submitting ? 'Registering...' : 'Register Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
