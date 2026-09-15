import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';

export default function AdminOrganizations() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Organizations Workspace</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Manage enterprise organization accounts, domains, and department sustainability.</p>
        </div>
        <button onClick={() => alert('Add Organization Modal')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 self-start cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Organization</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Organization Accounts</h3>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          Create organization accounts with corporate email domains to allow team members to track collective carbon reductions.
        </p>
      </div>
    </div>
  );
}