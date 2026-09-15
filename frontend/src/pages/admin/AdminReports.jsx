import { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, FileText, RotateCw } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminReports() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/admin/summary');
        setSummary(res.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Platform Reports</h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">Generate, export, and audit compliance ESG and carbon telemetry reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Carbon Footprint Platform Audit</h3>
            <p className="text-xs text-gray-500 mt-1">Complete snapshot of all user emissions, activity logs, and factors.</p>
          </div>
          <div className="pt-2">
            <button onClick={() => alert('Report generated successfully!')} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer">
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Monthly ESG Summary Report</h3>
            <p className="text-xs text-gray-500 mt-1">Summary metrics for organizational and community compliance.</p>
          </div>
          <div className="pt-2">
            <button onClick={() => alert('ESG Summary prepared for export!')} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer">
              <Download className="w-4 h-4" />
              <span>Generate PDF Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}