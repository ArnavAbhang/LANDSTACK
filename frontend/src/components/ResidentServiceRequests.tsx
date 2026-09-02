import React, { useState, useEffect } from 'react';
import { FileText, Plus, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ServiceRequestForm } from './ServiceRequestForm';

export const ResidentServiceRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchRequests = () => {
    fetch('http://localhost:8080/api/v1/service-requests?requesterId=CITIZEN-001', {
      headers: { 'X-User-Role': 'LAND_OWNER' }
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Citizen Land Governance Portal</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Land Service Applications</h2>
          <p className="text-xs text-slate-655 font-semibold">Track mutations, land record corrections, boundary verifications, and property tax applications.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-blue-200" />
          <span>New Land Service Application</span>
        </button>
      </div>

      {showForm && (
        <ServiceRequestForm
          onClose={() => setShowForm(false)}
          onRequestCreated={() => {
            fetchRequests();
          }}
        />
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req: any, idx: number) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm font-semibold text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3 font-medium">
              <div>
                <div className="font-mono text-xs font-bold text-blue-900">{req.requestNumber}</div>
                <h3 className="text-base font-black text-slate-900">{req.requestType}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                  req.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-805 border border-blue-200' :
                  req.status === 'ASSIGNED' || req.status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-805 border border-amber-200' :
                  req.status === 'APPROVED' || req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-805 border border-emerald-200' :
                  'bg-red-50 text-red-805 border border-red-200'
                }`}>
                  {req.status}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">Target SLA: 72 Hours</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Parcel ULPIN</span>
                <div className="font-mono font-bold text-slate-900 text-sm">{req.ulpin}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Target Department</span>
                <div className="font-bold text-slate-700">{req.department}</div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Submitted Date</span>
                <div className="font-mono text-slate-500">{req.createdAt?.substring(0, 10) || '2026-08-29'}</div>
              </div>
            </div>

            <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
              {req.description}
            </p>

            {/* Workflow Timeline */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm font-medium">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">End-to-End Workflow Progress Timeline</div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-emerald-700 font-extrabold">1. Submitted</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className={req.status !== 'SUBMITTED' ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>2. Validated</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className={req.status === 'ASSIGNED' || req.status === 'UNDER_REVIEW' || req.status === 'APPROVED' ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>3. Officer Review</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className={req.status === 'APPROVED' ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>4. Final Decision</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
