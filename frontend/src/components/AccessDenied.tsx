import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface AccessDeniedProps {
  reason?: string;
  onBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ reason, onBack }) => {
  return (
    <div className="bg-white border border-slate-205 p-8 rounded-2xl max-w-xl mx-auto text-center space-y-4 my-12 shadow-sm text-slate-900 font-sans">
      <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <ShieldAlert className="w-8 h-8 text-red-600" />
      </div>
      
      <div className="space-y-1 font-semibold">
        <h3 className="text-xl font-black text-slate-900">403 Access Restricted</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {reason || "You don't have permission to access this information under LAND STACK Security & Governance Policy."}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs text-slate-700 space-y-1 font-mono shadow-sm">
        <div>Security Policy: <strong className="text-slate-900">Role & Jurisdiction Scoping (Phase 7)</strong></div>
        <div>Audited Action: <strong className="text-red-700">UNAUTHORIZED_ACCESS_ATTEMPT</strong></div>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      )}
    </div>
  );
};
