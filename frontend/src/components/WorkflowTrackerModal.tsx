import React from 'react';
import { X, CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

interface WorkflowTrackerModalProps {
  request: any;
  onClose: () => void;
}

export const WorkflowTrackerModal: React.FC<WorkflowTrackerModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  const steps = [
    { title: 'Citizen Application Submitted', dept: 'CITIZEN_PORTAL', done: true, time: request.createdAt || '2026-08-27 10:00' },
    { title: 'Registration & Deed Verification', dept: 'REGISTRATION', done: request.status !== 'SUBMITTED', time: '2026-08-27 10:30' },
    { title: 'Automated Revenue Mutation Trigger', dept: 'SYSTEM_INTEROP', done: ['APPROVAL_PENDING', 'APPROVED', 'COMPLETED'].includes(request.status), time: '2026-08-27 11:00' },
    { title: 'Revenue Officer RoR Verification', dept: 'REVENUE', done: ['APPROVED', 'COMPLETED'].includes(request.status), time: '2026-08-27 11:45' },
    { title: 'Tax & Municipal Record Update', dept: 'TAX', done: request.status === 'COMPLETED', time: 'Pending Approval' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 font-sans">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Interdepartmental Workflow Status Tracker</span>
            </div>
            <h3 className="font-black text-slate-900 text-base mt-0.5">{request.id} — ULPIN: {request.ulpin}</h3>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-semibold">
          
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium shadow-sm">
            <div className="flex justify-between items-center text-slate-700">
              <div><span className="text-slate-500">Applicant:</span> <strong className="text-slate-900">{request.applicantName}</strong></div>
              <div><span className="text-slate-500 mr-2">Department:</span> <span className="bg-blue-50 text-blue-900 font-extrabold px-2.5 py-0.5 rounded border border-blue-200">{request.departmentCode}</span></div>
            </div>
            <div className="text-slate-700"><span className="text-slate-500">Details:</span> {request.details}</div>
          </div>

          <div className="space-y-4">
            <div className="font-black text-slate-900 text-sm">Lifecycle Timeline</div>
            <div className="space-y-3 font-medium">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm">
                  <div className={`p-1.5 rounded-full mt-0.5 ${step.done ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-500 border border-slate-300'}`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-655 font-bold mt-0.5">Department Scope: <span className="text-blue-900 font-extrabold">{step.dept}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-4 py-2 rounded-lg shadow-sm">
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
