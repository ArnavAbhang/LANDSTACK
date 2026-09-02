import React from 'react';
import { Home, AlertCircle, FileText, CheckCircle2, Clock, ShieldCheck, Download, PlusCircle } from 'lucide-react';

interface CitizenDashboardProps {
  onSelectParcel: (ulpin: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onSelectParcel }) => {
  const myProperties = [
    {
      ulpin: 'MH-27-PUN-001-8472',
      surveyNumber: '45/1',
      village: 'Paud, Mulshi, Pune (MH)',
      area: '1.25 Hectares',
      status: 'VERIFIED',
      taxStatus: 'PAID',
      clearance: 'CLEAR'
    },
    {
      ulpin: 'MH-27-PUN-002-9103',
      surveyNumber: '45/2',
      village: 'Paud, Mulshi, Pune (MH)',
      area: '0.85 Hectare',
      status: 'MISMATCH_DETECTED',
      taxStatus: 'OVERDUE (₹4,800)',
      clearance: 'ACTION_REQUIRED'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-sans text-slate-900">
      
      {/* Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Home className="w-4 h-4 text-emerald-700" />
            <span>Citizen Land Portal</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, Ramesh Anant Kulkarni
          </h2>
          <p className="text-xs text-slate-655 mt-1 font-semibold">
            Manage your land parcels, track revenue mutations, inspect property tax dues, and download digitally verified RoR certificates.
          </p>
        </div>

        <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4 text-emerald-200" />
          <span>Raise Citizen Service Request</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-bold">Registered Parcels</div>
          <div className="text-2xl font-black text-slate-900">2 Land Parcels</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 2.10 Hectares Total
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-bold">Property Tax Dues</div>
          <div className="text-2xl font-black text-amber-700">₹4,800.00</div>
          <div className="text-[11px] text-amber-700 font-extrabold">FY 2025-2026 Arrears</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-bold">Active Service Requests</div>
          <div className="text-2xl font-black text-blue-900">1 Pending</div>
          <div className="text-[11px] text-blue-700 font-extrabold">Mutation Status Inquiry</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <div className="text-slate-500 text-xs font-bold">Dispute Alerts</div>
          <div className="text-2xl font-black text-red-700">1 Boundary Suit</div>
          <div className="text-[11px] text-red-655 font-extrabold">Civil Suit CS/2024/9912</div>
        </div>
      </div>

      {/* Property List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>My Land Parcels (Linked to ULPIN)</span>
          </h3>
        </div>

        <div className="space-y-3 font-medium">
          {myProperties.map((prop) => (
            <div
              key={prop.ulpin}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">ULPIN: {prop.ulpin}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                    prop.clearance === 'CLEAR'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {prop.clearance}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Survey No: {prop.surveyNumber} • {prop.village} • Area: {prop.area}
                </p>
                <div className="text-xs text-slate-700 font-semibold">
                  Tax Status: <span className="font-extrabold text-amber-700">{prop.taxStatus}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => onSelectParcel(prop.ulpin)}
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex-1 md:flex-none text-center shadow-sm"
                >
                  View Full GIS Parcel Record
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
