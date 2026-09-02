import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck, FileText, CheckCircle2, XCircle, Clock, AlertTriangle, Layers, Database, ArrowRight, UserCheck } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'HEALTH' | 'CASES' | 'OPERATIONS' | 'REVENUE' | 'REGISTRATION' | 'TAX' | 'PLANNING' | 'UTILITIES' | 'DISPUTES' | 'AUDIT' | 'SCHEMA' | 'SECURITY' | 'INTEGRATION' | 'AADHAAR_VERIFICATIONS'>('SEARCH');
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [schemaMapping, setSchemaMapping] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchDashboardData = () => {
    fetch('http://localhost:8080/api/service-requests')
      .then((res) => res.json())
      .then((data) => setServiceRequests(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/audit')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/schema-mapping')
      .then((res) => res.json())
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
      .then((res) => res.json())
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
          <p className="text-xs text-slate-600 font-medium">
            Unified ULPIN-centric platform connecting Revenue, Registration, Tax, Planning, and Utilities.
          </p>
        </div>

        {/* Role Selection Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
          <span className="text-xs font-bold text-slate-600 pl-2">Department Scope:</span>
          <select
            value={activeRole}
            onChange={(e) => {
              onRoleChange(e.target.value);
              if (e.target.value.includes('REVENUE')) setActiveTab('REVENUE');
              else if (e.target.value.includes('REGISTRATION')) setActiveTab('REGISTRATION');
              else if (e.target.value.includes('TAX')) setActiveTab('TAX');
              else if (e.target.value.includes('PLANNING')) setActiveTab('PLANNING');
              else if (e.target.value.includes('DISPUTE')) setActiveTab('DISPUTES');
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

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('SEARCH')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'SEARCH' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Land & Owner Search
        </button>

        <button
          onClick={() => setActiveTab('HEALTH')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'HEALTH' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          System Health & Operations
        </button>

        <button
          onClick={() => setActiveTab('CASES')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'CASES' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Case Management Center
        </button>

        <button
          onClick={() => setActiveTab('OPERATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'OPERATIONS' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Operational Control Center
        </button>

        <button
          onClick={() => setActiveTab('REVENUE')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'REVENUE' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Revenue & RoRs
        </button>

        <button
          onClick={() => setActiveTab('REGISTRATION')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'REGISTRATION' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Deed Registration
        </button>

        <button
          onClick={() => setActiveTab('TAX')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'TAX' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Property Tax Dues
        </button>

        <button
          onClick={() => setActiveTab('PLANNING')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'PLANNING' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Urban Master Plan
        </button>

        <button
          onClick={() => setActiveTab('DISPUTES')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'DISPUTES' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Land Disputes
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'SECURITY' || activeTab === 'AUDIT' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Security & Audit Governance
        </button>

        <button
          onClick={() => setActiveTab('INTEGRATION')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'INTEGRATION' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Data Integration & GIS Sources
        </button>

        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'SCHEMA' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Interoperability & Data Integration
        </button>

        <button
          onClick={() => setActiveTab('AADHAAR_VERIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'AADHAAR_VERIFICATIONS' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-emerald-800 hover:text-emerald-900 border border-emerald-200 shadow-sm'
          }`}
        >
          Aadhaar Verifications Approval
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'AADHAAR_VERIFICATIONS' && (
        <AadhaarVerificationAdmin />
      )}

      {activeTab === 'SEARCH' && (
        <LandOwnerSearch />
      )}

      {activeTab === 'HEALTH' && (
        <SystemHealthDashboard />
      )}

      {activeTab === 'CASES' && (
        <CaseManagementDashboard />
      )}

      {activeTab === 'OPERATIONS' && (
        <OperationsControlCenter />
      )}

      {activeTab === 'REVENUE' && (
        <div className="space-y-6">
          {/* Revenue Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Pending Mutations</div>
              <div className="text-2xl font-black text-emerald-700">14 Applications</div>
              <div className="text-[10px] text-slate-500 font-medium">Requires Ferfar RoR Approval</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">RoR Verifications</div>
              <div className="text-2xl font-black text-blue-900">92 Verified</div>
              <div className="text-[10px] text-slate-500 font-medium">7/12 & 8A Digital Extracts</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Auto-Triggers Received</div>
              <div className="text-2xl font-black text-amber-700">6 Pending</div>
              <div className="text-[10px] text-slate-500 font-medium">From Registration Dept</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Active Revenue Stay</div>
              <div className="text-2xl font-black text-red-700">2 Injunctions</div>
              <div className="text-[10px] text-slate-500 font-medium">Court Injunction Linked</div>
            </div>
          </div>

          {/* Pending Revenue Workflows Queue Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Revenue Mutation Queue (ULPIN-Centric)</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Showing active interdepartmental requests</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="p-3">Request ID</th>
                    <th className="p-3">ULPIN</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Request Type</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Assigned Officer</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {serviceRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-blue-900 font-bold">{req.id}</td>
                      <td className="p-3 font-mono text-slate-900 font-bold">{req.ulpin}</td>
                      <td className="p-3">{req.applicantName}</td>
                      <td className="p-3 font-semibold">{req.requestType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-850 border border-emerald-200' : 'bg-amber-50 text-amber-850 border border-amber-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3">{req.assignedOfficer}</td>
                      <td className="p-3 space-x-2">
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

      {/* REGISTRATION TAB */}
      {activeTab === 'REGISTRATION' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Deed Registration & Stamps Interoperability Queue</h3>
            <span className="text-emerald-700 font-bold">Auto-triggers Mutation on Approval</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 font-medium">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900">Deed REG-PUN-2020-0192 (ULPIN: MH-27-PUN-002-9103)</span>
              <span className="text-amber-700 font-bold">APPROVAL_PENDING</span>
            </div>
            <p className="text-slate-655">
              Buyer: Ramesh & Sunita Kulkarni | Seller: Anant Kulkarni | Consideration: ₹48,50,000 | Stamp Duty Paid: ₹3,39,500
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleTransition('REQ-2026-002', 'APPROVED')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-lg text-xs shadow-sm"
              >
                Approve Deed & Trigger Auto-Mutation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTY TAX TAB */}
      {activeTab === 'TAX' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Municipal Property Tax Dues & Clearance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Total Tax Assessed</div>
              <div className="text-xl font-extrabold text-slate-900">₹14,80,000</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Total Paid</div>
              <div className="text-xl font-extrabold text-emerald-755">₹14,75,200</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Overdue Arrears</div>
              <div className="text-xl font-extrabold text-red-700">₹4,800.00</div>
            </div>
          </div>
        </div>
      )}

      {/* URBAN PLANNING TAB */}
      {activeTab === 'PLANNING' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Urban Planning & Master Plan Reservations</h3>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
            <div className="font-bold text-blue-900">PMRDA Master Plan 2030 Ring Road Alignment</div>
            <p className="text-slate-655">
              Parcel MH-27-PUN-002-9103 falls within 30m proposed Ring Road reservation buffer. Building permission restricted to non-permanent structures.
            </p>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === 'DISPUTES' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Revenue Court & Boundary Disputes</h3>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-700">Civil Suit CS/2024/9912 (Civil Court Pune)</span>
              <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded font-extrabold text-[10px]">STAY INJUNCTION</span>
            </div>
            <p className="text-slate-655">
              Boundary suit filed regarding 130 m² overlap along eastern fence with Survey Plot 126/4. Mutation updates blocked pending court final decree.
            </p>
          </div>
        </div>
      )}

      {/* SECURITY & AUDIT TAB */}
      {(activeTab === 'SECURITY' || activeTab === 'AUDIT') && (
        <SecurityGovernanceDashboard />
      )}

      {/* DATA INTEGRATION & GIS SOURCES TAB */}
      {activeTab === 'INTEGRATION' && (
        <IntegrationHealthDashboard />
      )}

      {/* SCHEMA MAPPING TAB */}
      {activeTab === 'SCHEMA' && (
        <InteroperabilityDashboard />
      )}

      {/* Tracker Modal */}
      {selectedRequest && (
        <WorkflowTrackerModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}

    </div>
  );
};
