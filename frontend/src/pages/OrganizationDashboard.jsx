import { useState, useEffect } from 'react';
import { Users, Leaf, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axiosConfig';

export default function OrganizationDashboard() {
  const [stats, setStats] = useState({ activeEmployees: 4280, avgDailyCo2PerEmployee: 8.4, totalCo2Saved: 2.4 });
  const [chartData, setChartData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const [statsRes, chartRes, empRes] = await Promise.all([
          api.get('/organization/stats'),
          api.get('/organization/department-breakdown'),
          api.get('/organization/employees')
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Organization Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Corporate Sustainability Reporting</p>
        </div>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all">
          Export CSR Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading organization data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center text-gray-400 font-bold uppercase tracking-wider mb-2 text-xs"><Users className="w-4 h-4 mr-2"/> Active Employees</div>
              <h2 className="text-4xl font-extrabold text-gray-900">{stats.activeEmployees}</h2>
              <p className="text-green-500 font-semibold text-xs flex items-center mt-2"><ArrowUpRight className="w-4 h-4 mr-1"/> Active in DB</p>
            </div>
            
            <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center text-gray-400 font-bold uppercase tracking-wider mb-2 text-xs"><Leaf className="w-4 h-4 mr-2"/> Avg Daily CO₂ / Employee</div>
              <h2 className="text-4xl font-extrabold text-gray-900">{stats.avgDailyCo2PerEmployee.toFixed(1)} <span className="text-lg font-medium text-gray-500">kg</span></h2>
              <p className="text-orange-500 font-semibold text-xs flex items-center mt-2"><ArrowUpRight className="w-4 h-4 mr-1"/> Target: 6 kg/day</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[1.5rem] shadow-lg shadow-green-200 text-white relative overflow-hidden">
              <div className="text-green-200 font-bold uppercase tracking-wider mb-2 text-xs">Total CO₂ Saved</div>
              <h2 className="text-4xl font-extrabold text-white">{stats.totalCo2Saved.toFixed(1)} <span className="text-lg font-medium text-green-200">Tons</span></h2>
              <p className="text-green-100 font-semibold text-xs flex items-center mt-2"><ArrowDownRight className="w-4 h-4 mr-1"/> Cumulative</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Emissions by Department & Category</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Bar dataKey="transport" stackId="a" fill="#16a34a" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="electricity" stackId="a" fill="#2563eb" />
                  <Bar dataKey="food" stackId="a" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CSR Employee Table */}
          <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">CSR Employee Footprint Comparison</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="p-6">Employee</th>
                  <th className="p-6">Email</th>
                  <th className="p-6 text-center">Log Count</th>
                  <th className="p-6 text-right">Total Emitted (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-6 font-semibold text-gray-900">{emp.name}</td>
                    <td className="p-6 text-gray-500 font-medium">{emp.email}</td>
                    <td className="p-6 text-center font-bold text-gray-600">{emp.logCount}</td>
                    <td className="p-6 text-right font-extrabold text-gray-900">{emp.totalCo2e.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
