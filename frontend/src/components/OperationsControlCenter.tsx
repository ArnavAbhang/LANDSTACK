import React from 'react';
import { Activity, CheckCircle2, Clock, AlertTriangle, Layers, Building2, Globe, TrendingUp, ShieldCheck } from 'lucide-react';

export const OperationsControlCenter: React.FC = () => {
  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Operational Control Center & Delivery Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Land Governance Operations & Service Delivery Command</h2>
          <p className="text-xs text-slate-600 font-semibold">Real-time state service resolution metrics, SLA compliance performance, and department workload monitoring.</p>
        </div>
      </div>

      {/* SLA & Service Delivery Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Total Service Requests</span>
          <div className="text-2xl font-black text-slate-900">1,482</div>
          <div className="text-[10px] text-emerald-800 font-extrabold">+12% vs last month</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">SLA Compliance Rate</span>
          <div className="text-2xl font-black text-emerald-700">97.8%</div>
          <div className="text-[10px] text-slate-500">Target SLA Compliance &gt; 95%</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Average Resolution Time</span>
          <div className="text-2xl font-black text-blue-900 font-sans">18.4 Hrs</div>
          <div className="text-[10px] text-slate-500">Target Resolution &lt; 72 Hrs</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">SLA Breached Cases</span>
          <div className="text-2xl font-black text-amber-700">2</div>
          <div className="text-[10px] text-amber-700 font-extrabold">Escalated to District Collector</div>
        </div>
      </div>

      {/* Department Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-blue-755" />
            <span>Department Service Delivery Resolution</span>
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-sm font-medium">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">Revenue & Land Records (7/12 RoR, Mutations)</span>
                <span className="text-emerald-700">98.2% SLA</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[98%]"></div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-sm font-medium">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">Stamps & Registration (Deeds, Encumbrances)</span>
                <span className="text-emerald-700">97.5% SLA</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[97%]"></div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-sm font-medium">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">Cadastral Survey & Settlement (Boundary Check)</span>
                <span className="text-amber-700">92.1% SLA</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full w-[92%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Workload */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-purple-755" />
            <span>State & District Workload Distribution</span>
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm font-medium">
              <div>
                <div className="font-bold text-slate-900">Maharashtra (Pune / Haveli / Paud)</div>
                <div className="text-slate-500 text-[11px] font-semibold">842 Active Cases | 14 Pending Field Verifications</div>
              </div>
              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                MH_ACTIVE
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm font-medium">
              <div>
                <div className="font-bold text-slate-900">Tamil Nadu (Kanchipuram / Chengalpattu / Sriperumbudur)</div>
                <div className="text-slate-500 text-[11px] font-semibold">410 Active Cases | 6 Pending Field Verifications</div>
              </div>
              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                TN_ACTIVE
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
