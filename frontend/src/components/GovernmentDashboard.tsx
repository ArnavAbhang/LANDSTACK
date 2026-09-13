import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck, FileText, CheckCircle2, XCircle, Clock, AlertTriangle, Layers, Database, ArrowRight, UserCheck, Search, Briefcase, Activity, Landmark, Shield } from 'lucide-react';
import { WorkflowTrackerModal } from './WorkflowTrackerModal';
import { InteroperabilityDashboard } from './InteroperabilityDashboard';
import { SecurityGovernanceDashboard } from './SecurityGovernanceDashboard';
import { IntegrationHealthDashboard } from './IntegrationHealthDashboard';
import { CaseManagementDashboard } from './CaseManagementDashboard';
import { OperationsControlCenter } from './OperationsControlCenter';
import { SystemHealthDashboard } from './SystemHealthDashboard';
import { LandOwnerSearch } from './LandOwnerSearch';
import { AadhaarVerificationAdmin } from './AadhaarVerificationAdmin';

interface GovernmentDashboardProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({ activeRole, onRoleChange }) => {
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'CASES' | 'OPERATIONS' | 'SECURITY' | 'AADHAAR_VERIFICATIONS'>('CASES');
  const [deptSubTab, setDeptSubTab] = useState<'REVENUE' | 'REGISTRATION' | 'TAX' | 'PLANNING' | 'DISPUTES'>('REVENUE');
  const [secSubTab, setSecSubTab] = useState<'SECURITY_AUDIT' | 'INTEGRATION' | 'SCHEMA' | 'HEALTH'>('SECURITY_AUDIT');

  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [schemaMapping, setSchemaMapping] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchDashboardData = () => {
    fetch('http://localhost:8080/api/service-requests')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setServiceRequests(data);
      })
      .catch(() => {});

    fetch('http://localhost:8080/api/audit')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch(() => {});

    fetch('http://localhost:8080/api/schema-mapping')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSchemaMapping(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTransition = (requestId: string, nextState: string) => {
    fetch(`http://localhost:8080/api/workflows/${requestId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nextState: nextState,
        actorRole: activeRole,
        actorName: 'Authorized Officer',
        comments: `Workflow transitioned to ${nextState}`
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(() => fetchDashboardData())
      .catch(() => {});
  };

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-slate-50 p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Top Header & Role Switcher */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Interoperable Government Land Stack Portal</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Department Governance & Multi-Agency Workflow Hub</h2>
          <p className="text-xs text-slate-600 font-semibold">
            Unified ULPIN-centric platform connecting Revenue, Registration, Tax, Planning, and Utilities.
          </p>
        </div>

        {/* Role Selection Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs font-bold">
          <span className="text-slate-600 pl-2">Department Scope:</span>
          <select
            value={activeRole}
            onChange={(e) => {
              onRoleChange(e.target.value);
              setActiveTab('OPERATIONS');
              if (e.target.value.includes('REVENUE')) setDeptSubTab('REVENUE');
              else if (e.target.value.includes('REGISTRATION')) setDeptSubTab('REGISTRATION');
              else if (e.target.value.includes('TAX')) setDeptSubTab('TAX');
              else if (e.target.value.includes('PLANNING')) setDeptSubTab('PLANNING');
              else if (e.target.value.includes('DISPUTE')) setDeptSubTab('DISPUTES');
            }}
            className="bg-white border border-slate-300 text-slate-900 font-bold text-xs rounded-lg px-3 py-1.5 focus:ring-blue-700 focus:border-blue-700 shadow-sm"
          >
            <option value="REVENUE_OFFICER">Revenue Officer (Tahashildar/Talathi)</option>
            <option value="REGISTRATION_OFFICER">Deed Registrar (Sub-Registrar)</option>
            <option value="TAX_OFFICER">Property Tax Department</option>
            <option value="PLANNING_OFFICER">Urban Planning Authority</option>
            <option value="UTILITIES_OFFICER">Utility Services Dept</option>
            <option value="DISPUTE_OFFICER">Revenue Court Registrar</option>
            <option value="ADMIN">System Administrator (Hub)</option>
          </select>
        </div>
      </div>

      {/* Clean Primary Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('CASES')}
          className={`p-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'CASES'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700'
              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm hover:border-blue-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Case Management Center</span>
        </button>

        <button
          onClick={() => setActiveTab('SEARCH')}
          className={`p-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'SEARCH'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700'
              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm hover:border-blue-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Land & Owner Search</span>
        </button>

        <button
          onClick={() => setActiveTab('OPERATIONS')}
          className={`p-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'OPERATIONS'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700'
              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm hover:border-blue-300'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Department Operations</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`p-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'SECURITY'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700'
              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm hover:border-blue-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Governance</span>
        </button>

        <button
          onClick={() => setActiveTab('AADHAAR_VERIFICATIONS')}
          className={`p-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'AADHAAR_VERIFICATIONS'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600'
              : 'bg-white text-emerald-800 hover:text-emerald-900 border-emerald-200 shadow-sm hover:border-emerald-300'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Aadhaar Verifications</span>
        </button>
      </div>

      {/* Primary Tab Views */}
      {activeTab === 'CASES' && (
        <CaseManagementDashboard />
      )}

      {activeTab === 'SEARCH' && (
        <LandOwnerSearch />
      )}

      {activeTab === 'AADHAAR_VERIFICATIONS' && (
        <AadhaarVerificationAdmin />
      )}

      {/* DEPARTMENT OPERATIONS TAB (WITH SUB-NAVIGATION) */}
      {activeTab === 'OPERATIONS' && (
        <div className="space-y-6">
          {/* Department Sub-Pill Selector */}
          <div className="bg-white border border-slate-200 p-2 rounded-2xl flex flex-wrap gap-2 shadow-sm text-xs font-bold">
            <button
              onClick={() => setDeptSubTab('REVENUE')}
              className={`px-4 py-2 rounded-xl transition-all ${
                deptSubTab === 'REVENUE' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue & RoR (7/12 & Patta)
            </button>
            <button
              onClick={() => setDeptSubTab('REGISTRATION')}
              className={`px-4 py-2 rounded-xl transition-all ${
                deptSubTab === 'REGISTRATION' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deed Registration (SRO)
            </button>
            <button
              onClick={() => setDeptSubTab('TAX')}
              className={`px-4 py-2 rounded-xl transition-all ${
                deptSubTab === 'TAX' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Property Tax Dues
            </button>
            <button
              onClick={() => setDeptSubTab('PLANNING')}
              className={`px-4 py-2 rounded-xl transition-all ${
                deptSubTab === 'PLANNING' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Urban Master Planning
            </button>
            <button
              onClick={() => setDeptSubTab('DISPUTES')}
              className={`px-4 py-2 rounded-xl transition-all ${
                deptSubTab === 'DISPUTES' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Court Disputes
            </button>
          </div>

          {/* Sub Tab: REVENUE */}
          {deptSubTab === 'REVENUE' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Pending Mutations</div>
                  <div className="text-2xl font-black text-amber-700">14 Applications</div>
                  <div className="text-[10px] text-slate-500 font-medium">Requires Ferfar RoR Approval</div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">RoR Verifications</div>
                  <div className="text-2xl font-black text-blue-900">92 Verified</div>
                  <div className="text-[10px] text-slate-500 font-medium">7/12 & 8A Digital Extracts</div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Auto-Triggers Received</div>
                  <div className="text-2xl font-black text-emerald-700">6 Pending</div>
                  <div className="text-[10px] text-slate-500 font-medium">From Registration Dept</div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Active Revenue Stay</div>
                  <div className="text-2xl font-black text-red-700">2 Injunctions</div>
                  <div className="text-[10px] text-slate-500 font-medium">Court Injunction Linked</div>
                </div>
              </div>

              {/* Service Requests Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Revenue Mutation Queue (ULPIN-Centric)</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">Showing active interdepartmental requests</span>
                </div>

                <div className="overflow-x-auto text-xs font-semibold">
                  <table className="w-full text-left border-collapse font-medium">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                        <th className="p-3">Request ID</th>
                        <th className="p-3">ULPIN</th>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Request Type</th>
                        <th className="p-3">Current Status</th>
                        <th className="p-3">Assigned Officer</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                      {serviceRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono text-blue-900 font-bold">{req.id}</td>
                          <td className="p-3 font-mono text-slate-900 font-bold">{req.ulpin}</td>
                          <td className="p-3 font-bold">{req.applicantName || 'Citizen Applicant'}</td>
                          <td className="p-3 font-semibold">{req.requestType}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                              req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3">{req.assignedOfficer || 'Tahashildar Haveli'}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="bg-white hover:bg-slate-50 text-slate-800 px-2.5 py-1 rounded border border-slate-300 text-[11px] font-bold shadow-sm"
                            >
                              Tracker
                            </button>
                            <button
                              onClick={() => handleTransition(req.id, 'APPROVED')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-[11px] font-extrabold shadow-sm"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab: REGISTRATION */}
          {deptSubTab === 'REGISTRATION' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Deed Registration & Stamps Interoperability Queue</h3>
                <span className="text-emerald-700 font-bold">Auto-triggers Mutation on Approval</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 font-medium">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Deed REG-PUN-2020-0192 (ULPIN: MH-27-PUN-000002)</span>
                  <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded text-xs">APPROVAL_PENDING</span>
                </div>
                <p className="text-slate-700">
                  Buyer: Ramesh & Sunita Kulkarni | Seller: Anant Kulkarni | Consideration: ₹48,50,000 | Stamp Duty Paid: ₹3,39,500
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleTransition('REQ-2026-002', 'APPROVED')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm"
                  >
                    Approve Deed & Trigger Auto-Mutation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab: TAX */}
          {deptSubTab === 'TAX' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Municipal Property Tax Dues & Clearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Total Tax Assessed</div>
                  <div className="text-2xl font-black text-slate-900">₹14,80,000</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Total Collection Paid</div>
                  <div className="text-2xl font-black text-emerald-700">₹14,75,200</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Overdue Arrears</div>
                  <div className="text-2xl font-black text-red-700">₹4,800.00</div>
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab: PLANNING */}
          {deptSubTab === 'PLANNING' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Urban Planning & Master Plan Reservations</h3>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-blue-900 text-sm">PMRDA Master Plan 2030 Ring Road Alignment</div>
                <p className="text-slate-700">
                  Parcel MH-27-PUN-000004 falls within 30m proposed Ring Road reservation buffer. Building permission restricted to non-permanent structures.
                </p>
              </div>
            </div>
          )}

          {/* Sub Tab: DISPUTES */}
          {deptSubTab === 'DISPUTES' && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Revenue Court & Boundary Disputes</h3>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-700 text-sm">Civil Suit CS/2024/9912 (Civil Court Pune)</span>
                  <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 py-0.5 rounded font-extrabold text-[10px]">STAY INJUNCTION</span>
                </div>
                <p className="text-slate-700">
                  Boundary suit filed regarding 130 m² overlap along eastern fence with Survey Plot 126/4. Mutation updates blocked pending court final decree.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECURITY & GOVERNANCE TAB (WITH SUB-NAVIGATION) */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-2 rounded-2xl flex flex-wrap gap-2 shadow-sm text-xs font-bold">
            <button
              onClick={() => setSecSubTab('SECURITY_AUDIT')}
              className={`px-4 py-2 rounded-xl transition-all ${
                secSubTab === 'SECURITY_AUDIT' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security Governance & Audit Logs
            </button>
            <button
              onClick={() => setSecSubTab('INTEGRATION')}
              className={`px-4 py-2 rounded-xl transition-all ${
                secSubTab === 'INTEGRATION' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Integration & GIS Sources
            </button>
            <button
              onClick={() => setSecSubTab('SCHEMA')}
              className={`px-4 py-2 rounded-xl transition-all ${
                secSubTab === 'SCHEMA' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interoperability & Data Standard Mapping
            </button>
            <button
              onClick={() => setSecSubTab('HEALTH')}
              className={`px-4 py-2 rounded-xl transition-all ${
                secSubTab === 'HEALTH' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Health & Operations Control
            </button>
          </div>

          {secSubTab === 'SECURITY_AUDIT' && <SecurityGovernanceDashboard />}
          {secSubTab === 'INTEGRATION' && <IntegrationHealthDashboard />}
          {secSubTab === 'SCHEMA' && <InteroperabilityDashboard />}
          {secSubTab === 'HEALTH' && <SystemHealthDashboard />}
        </div>
      )}

      {/* Tracker Modal */}
      {selectedRequest && (
        <WorkflowTrackerModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}

    </div>
  );
};
