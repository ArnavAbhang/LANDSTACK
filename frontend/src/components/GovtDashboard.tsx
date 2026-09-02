import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, FileCheck, Layers, BarChart3, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface GovtDashboardProps {
  currentRole: string;
}

export const GovtDashboard: React.FC<GovtDashboardProps> = ({ currentRole }) => {
  const departmentName =
    currentRole === 'REVENUE_OFFICER'
      ? 'Revenue & Land Records Department'
      : currentRole === 'REGISTRATION_OFFICER'
      ? 'Property Registration & Deed Department'
      : currentRole === 'TAX_OFFICER'
      ? 'Property Tax & Local Body Department'
      : 'Ministry of Rural Development (DoLR Hub)';

  const landUseData = [
    { name: 'Agricultural', count: 420 },
    { name: 'Residential', count: 185 },
    { name: 'Commercial', count: 95 },
    { name: 'Industrial', count: 60 },
  ];

  const mutationData = [
    { month: 'Oct', approved: 45, pending: 12 },
    { month: 'Nov', approved: 52, pending: 8 },
    { month: 'Dec', approved: 60, pending: 15 },
    { month: 'Jan', approved: 48, pending: 9 },
    { month: 'Feb', approved: 65, pending: 6 },
  ];

  const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 font-sans">
      
      {/* Department Banner Header */}
      <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-blue-700" />
            <span>Government Governance Hub</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {departmentName}
          </h2>
          <p className="text-xs text-slate-655 mt-1 font-semibold">
            Real-time department governance analytics, mutation approval workflows, PostGIS spatial anomaly tracking, and interoperability status.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-xs text-blue-900 font-extrabold shadow-sm">
          <ShieldAlert className="w-4 h-4 text-blue-700" />
          <span>Department Scope Active</span>
        </div>
      </div>

      {/* Top Governance KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Total Locality Parcels</div>
          <div className="text-2xl font-black text-slate-900">760 Parcels</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-extrabold">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> 100% ULPIN Mapped
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Source Verified Records</div>
          <div className="text-2xl font-black text-emerald-700">94.2%</div>
          <div className="text-[11px] text-slate-500 font-medium">716/760 Verified</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Active Pending Mutations</div>
          <div className="text-2xl font-black text-amber-700">14 Workflows</div>
          <div className="text-[11px] text-amber-700 font-extrabold">Avg response: 3.2 days</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">High Dispute Risk Parcels</div>
          <div className="text-2xl font-black text-red-700">3 Flagged</div>
          <div className="text-[11px] text-red-700 font-extrabold">AI Risk Triggered</div>
        </div>
      </div>

      {/* Analytics Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mutation Approvals Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              <span>Revenue Mutation Approval Volume</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Past 5 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mutationData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Use Distribution Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-700" />
              <span>Locality Land-Use Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-bold">Total 760 Parcels</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landUseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
