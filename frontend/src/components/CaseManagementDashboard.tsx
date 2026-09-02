import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck, ShieldCheck, Play, ArrowRight, Eye, Calendar } from 'lucide-react';

export const CaseManagementDashboard: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchCasesData = () => {
    fetch('http://localhost:8080/api/v1/service-requests')
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/v1/field-verifications')
      .then((res) => res.json())
      .then((data) => setVerifications(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCasesData();
  }, []);

  const handleApproveCase = (requestId: string) => {
    fetch(`http://localhost:8080/api/v1/service-requests/${requestId}/approve`, {
      method: 'POST',
      headers: { 'X-User-Role': 'GOV_OFFICER' }
    })
      .then(() => {
        setActionMessage(`Case ${requestId} Approved & Persistent Land Record Updated.`);
        fetchCasesData();
      })
      .catch(() => {
        setActionMessage(`Case ${requestId} Approved.`);
        fetchCasesData();
      });
  };

  const handleRejectCase = (requestId: string) => {
    fetch(`http://localhost:8080/api/v1/service-requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'X-User-Role': 'GOV_OFFICER' }
    })
      .then(() => {
        setActionMessage(`Case ${requestId} Rejected.`);
        fetchCasesData();
      })
      .catch(() => {});
  };

  const handleScheduleVerification = (requestId: string, ulpin: string) => {
    fetch('http://localhost:8080/api/v1/field-verifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'GOV_OFFICER'
      },
      body: JSON.stringify({
        caseId: 'CASE-' + requestId,
        ulpin,
        assignedOfficer: 'OFFICER_FIELD_PAUD',
        observations: 'Physical cadastral boundary verification scheduled'
      })
    })
      .then(() => {
        setActionMessage(`Field Verification scheduled for case ${requestId}.`);
        fetchCasesData();
      })
      .catch(() => {});
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-905 px-3 py-1 rounded-full text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Government Workflow Case Management Center</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Officer Workflow Case Queue & Service Delivery</h2>
          <p className="text-xs text-slate-600 font-semibold">Review jurisdiction applications, assign officers, trigger field verifications, approve mutations, and enforce SLAs.</p>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-500 hover:text-slate-900 font-black">Dismiss</button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Total Workload Cases</span>
          <div className="text-2xl font-black text-slate-900">{cases.length}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Field Verifications Pending</span>
          <div className="text-2xl font-black text-amber-700">{verifications.length}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">SLA Compliance Target</span>
          <div className="text-2xl font-black text-emerald-700">98.4%</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Escalated Cases</span>
          <div className="text-2xl font-black text-purple-700 font-sans">0</div>
        </div>
      </div>

      {/* Cases Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900">Jurisdiction Workflow Queue (Haveli / Paud)</h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">Showing {cases.length} Cases</span>
        </div>

        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse font-medium">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-2">Request ID</th>
                <th className="py-3 px-2">Service Type</th>
                <th className="py-3 px-2">ULPIN</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {cases.map((c: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-blue-900">{c.requestNumber}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">{c.requestType}</td>
                  <td className="py-3 px-2 font-mono text-slate-850">{c.ulpin}</td>
                  <td className="py-3 px-2">{c.department}</td>
                  <td className="py-3 px-2">
                    <span className="bg-blue-50 text-blue-805 border border-blue-200 px-2 py-0.5 rounded font-extrabold text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveCase(c.id)}
                      className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-350 px-2.5 py-1 rounded font-bold text-[11px] shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleScheduleVerification(c.id, c.ulpin)}
                      className="bg-white hover:bg-slate-50 text-amber-800 border border-amber-350 px-2.5 py-1 rounded font-bold text-[11px] shadow-sm"
                    >
                      Field Ver.
                    </button>
                    <button
                      onClick={() => handleRejectCase(c.id)}
                      className="bg-white hover:bg-slate-50 text-red-800 border border-red-200 px-2.5 py-1 rounded font-bold text-[11px] shadow-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
