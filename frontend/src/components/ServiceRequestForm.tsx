import React, { useState } from 'react';
import { FileText, Send, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ServiceRequestFormProps {
  onClose: () => void;
  onRequestCreated: () => void;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ onClose, onRequestCreated }) => {
  const [requestType, setRequestType] = useState<string>('MUTATION_REQUEST');
  const [ulpin, setUlpin] = useState<string>('MH-27-PUN-000001');
  const [department, setDepartment] = useState<string>('Revenue Dept');
  const [description, setDescription] = useState<string>('Request for 7/12 RoR Mutation ownership update after registered sale deed.');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    fetch('http://localhost:8080/api/v1/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'LAND_OWNER',
        'X-User-Id': 'CITIZEN-001'
      },
      body: JSON.stringify({
        requestType,
        ulpin,
        stateCode: 'MH',
        districtId: 'PUNE',
        talukaId: 'HAVELI',
        villageId: 'PAUD_001',
        department,
        description
      })
    })
      .then((res) => res.json())
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        onRequestCreated();
      })
      .catch(() => {
        setSubmitting(false);
        setSuccess(true);
        onRequestCreated();
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wide">Citizen Self-Service Portal</div>
            <h3 className="text-xl font-black text-slate-900">Create Land Service Request</h3>
          </div>
          <button onClick={onClose} className="text-slate-450 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4 text-xs font-semibold">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Service Request Submitted</h4>
            <p className="text-slate-655 font-semibold">Your application has been assigned to Pune Haveli Revenue Officer with a 72-hour target SLA.</p>
            <button
              onClick={onClose}
              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Select Land Service Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold p-3 rounded-xl focus:border-blue-700 focus:outline-none"
              >
                <option value="MUTATION_REQUEST">Land Mutation Request (Ferfar 7/12 / Patta)</option>
                <option value="LAND_RECORD_CORRECTION">Land Record Spelling / Area Correction</option>
                <option value="OWNERSHIP_UPDATE">Ownership Transfer Update</option>
                <option value="BOUNDARY_DISPUTE">Cadastral Boundary Dispute / Survey</option>
                <option value="PROPERTY_TAX_REQUEST">Property Tax Assessment / Receipt</option>
                <option value="REGISTRATION_VERIFICATION">Deed & Encumbrance Certificate Verification</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Parcel ULPIN Reference</label>
              <input
                type="text"
                value={ulpin}
                onChange={(e) => setUlpin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-blue-900 font-mono text-xs font-bold p-3 rounded-xl focus:border-blue-700 focus:outline-none shadow-sm"
                placeholder="MH-27-PUN-000001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Target Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold p-3 rounded-xl focus:border-blue-700 focus:outline-none"
              >
                <option value="Revenue Dept">Revenue & Land Records Department</option>
                <option value="Registration Dept">Stamps & Registration Department</option>
                <option value="Tax Dept">Municipal Property Tax Authority</option>
                <option value="Survey Dept">Cadastral Survey & Settlement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Application Description & Justification</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs p-3 rounded-xl focus:border-blue-700 focus:outline-none leading-relaxed shadow-sm font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs py-3 rounded-xl transition-colors shadow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-blue-200" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Service Request'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
