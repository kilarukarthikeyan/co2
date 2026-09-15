import { Users, Leaf, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function OrganizationDashboard() {
  const data = [
    { department: 'Engineering', transport: 400, electricity: 240, food: 150 },
    { department: 'Sales', transport: 800, electricity: 120, food: 300 },
    { department: 'Marketing', transport: 200, electricity: 300, food: 200 },
    { department: 'HR', transport: 150, electricity: 100, food: 100 },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center text-gray-500 font-bold uppercase tracking-wider mb-2 text-sm"><Users className="w-4 h-4 mr-2"/> Active Employees</div>
          <h2 className="text-5xl font-extrabold text-gray-900">4,280</h2>
          <p className="text-green-500 font-semibold text-sm flex items-center mt-2"><ArrowUpRight className="w-4 h-4 mr-1"/> 18% this month</p>
        </div>
        
        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center text-gray-500 font-bold uppercase tracking-wider mb-2 text-sm"><Leaf className="w-4 h-4 mr-2"/> Avg Daily CO₂ / Employee</div>
          <div className="flex items-baseline">
            <h2 className="text-5xl font-extrabold text-gray-900">8.4</h2>
            <span className="text-gray-500 ml-2 font-bold">kg</span>
          </div>
          <p className="text-orange-500 font-semibold text-sm flex items-center mt-2"><ArrowUpRight className="w-4 h-4 mr-1"/> Target: 6 kg/day</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[1.5rem] shadow-lg shadow-green-200 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl"></div>
          <div className="text-green-200 font-bold uppercase tracking-wider mb-2 text-sm">Total CO₂ Saved</div>
          <div className="flex items-baseline">
            <h2 className="text-5xl font-extrabold text-white">2.4</h2>
            <span className="text-green-100 ml-2 font-bold">Tons</span>
          </div>
          <p className="text-green-50 font-semibold text-sm flex items-center mt-2"><ArrowDownRight className="w-4 h-4 mr-1"/> vs previous quarter</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Emissions by Department & Category</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="transport" stackId="a" fill="#16a34a" radius={[0, 0, 4, 4]} />
              <Bar dataKey="electricity" stackId="a" fill="#2563eb" />
              <Bar dataKey="food" stackId="a" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
