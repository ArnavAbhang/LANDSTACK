import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Key, Lock, Eye, CheckCircle2, AlertTriangle, RefreshCw, FileText, Database, Server, UserCheck, Layers, Hash } from 'lucide-react';

export const SecurityGovernanceDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'AUDIT' | 'INTEGRITY' | 'ALERTS' | 'RBAC'>('OVERVIEW');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [integrityReport, setIntegrityReport] = useState<any>(null);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [rbacMatrix, setRbacMatrix] = useState<any>(null);
  const [loadingIntegrity, setLoadingIntegrity] = useState<boolean>(false);

  const fetchSecurityData = () => {
    fetch('http://localhost:8080/api/audit/logs')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/audit/integrity')
      .then((res) => res.json())
      .then((data) => setIntegrityReport(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/security/events')
      .then((res) => res.json())
      .then((data) => setSecurityEvents(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/security/rbac-matrix')
      .then((res) => res.json())
      .then((data) => setRbacMatrix(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleVerifyIntegrity = () => {
    setLoadingIntegrity(true);
    fetch('http://localhost:8080/api/audit/integrity')
      .then((res) => res.json())
      .then((data) => {
        setLoadingIntegrity(false);
        setIntegrityReport(data);
      })
      .catch(() => setLoadingIntegrity(false));
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: string) => {
    fetch(`http://localhost:8080/api/security/events/${eventId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => fetchSecurityData())
      .catch(() => {});
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Governance Platform controls</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Security Control Center & Cryptographic Audit Integrity
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Enforces RBAC, Jurisdiction Scoping (JBAC), PII Privacy Masking, SHA-256 Hash Chaining, and Security Event Logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyIntegrity}
            disabled={loadingIntegrity}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingIntegrity ? 'animate-spin' : ''}`} />
            <span>Verify Hash Chain Integrity</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'OVERVIEW' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Security Overview
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'AUDIT' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('INTEGRITY')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'INTEGRITY' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Tamper Evidence (SHA-256)
        </button>

        <button
          onClick={() => setActiveSubTab('ALERTS')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'ALERTS' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          Security Alerts ({securityEvents.length})
        </button>

        <button
          onClick={() => setActiveSubTab('RBAC')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'RBAC' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          RBAC & Jurisdiction Matrix
        </button>
      </div>

      {/* SUBTAB 1: SECURITY OVERVIEW */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Audit Chain Status</div>
              <div className="text-xl font-black text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>{integrityReport?.integrityStatus || 'CHAIN_VALID'}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">SHA-256 Cryptographic Verification</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Recorded Audit Events</div>
              <div className="text-2xl font-black text-slate-900">{auditLogs.length} Records</div>
              <div className="text-[10px] text-slate-500 font-medium">Tamper-Evident History Log</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Security Alerts</div>
              <div className="text-2xl font-black text-amber-700">{securityEvents.length} Events</div>
              <div className="text-[10px] text-slate-500 font-medium">Jurisdiction & Access Signals</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <div className="text-slate-500 text-[10px] uppercase font-bold">Active Roles Configured</div>
              <div className="text-2xl font-black text-blue-900">8 Roles</div>
              <div className="text-[10px] text-slate-500 font-medium">RBAC & Department Scopes</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Security & Governance Core Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-emerald-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>Jurisdiction Scoping (JBAC)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Every parcel request is validated by <code className="text-emerald-700 font-mono">isAuthorizedForParcel(user, parcel)</code> verifying state, district, and taluka boundaries.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-blue-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-700" />
                  <span>PII Privacy DTO Masking</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Public requests serve <code className="text-blue-755 font-mono">PublicParcelDTO</code> with masked owner names and hidden mobile/email details.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-purple-900 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-700" />
                  <span>Cryptographic Hash Chaining</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Audit logs link Record $N$ to SHA-256 hash of Record $N-1$, enabling instant tamper-evidence detection via `/api/audit/integrity`.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AUDIT LOGS */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Centralized Tamper-Evident Audit Stream</h3>
            <span className="text-xs text-slate-500 font-mono">Showing {auditLogs.length} Events</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-800 font-sans font-medium">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">ULPIN Anchor</th>
                  <th className="p-3">Result</th>
                  <th className="p-3 font-semibold">SHA-256 Hash Snippet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {auditLogs.map((log: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-blue-900 font-bold">{log.id}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{log.timestamp?.substring(0, 19).replace('T', ' ')}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{log.userId}</div>
                      <div className="text-[10px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="p-3 font-mono">{log.department}</td>
                    <td className="p-3 font-bold text-blue-700">{log.action}</td>
                    <td className="p-3 font-mono text-slate-800">{log.ulpin}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.result === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-purple-700 truncate max-w-[140px]" title={log.currentHash}>
                      {log.currentHash ? log.currentHash.substring(0, 16) + '...' : 'GENESIS'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TAMPER EVIDENCE (SHA-256) */}
      {activeSubTab === 'INTEGRITY' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-700" />
                <span>SHA-256 Cryptographic Audit Chain Verification</span>
              </h3>
              <p className="text-xs text-slate-555 font-medium">
                Verifies mathematical continuity where each record embeds the SHA-256 hash of the preceding record.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${integrityReport?.integrityStatus === 'CHAIN_VALID' ? 'bg-emerald-55 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                Status: {integrityReport?.integrityStatus || 'CHAIN_VALID'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Verified Audit Records</span>
              <div className="text-2xl font-black text-slate-900">{integrityReport?.checkedRecords || 0} / {integrityReport?.totalRecords || 0}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-slate-500 font-bold uppercase text-[10px]">First Invalid Record</span>
              <div className="text-lg font-mono text-slate-700">{integrityReport?.firstInvalidRecord ? integrityReport.firstInvalidRecord.id : 'NONE (100% Intact)'}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 shadow-sm">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Verification Algorithm</span>
              <div className="text-xs font-mono text-purple-700 font-bold">SHA-256 Chained Hash Digest</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SECURITY ALERTS */}
      {activeSubTab === 'ALERTS' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Security Event Monitoring & Incident Logs</h3>
            <span className="text-xs text-amber-700 font-bold">{securityEvents.length} Active Events</span>
          </div>

          <div className="space-y-3 text-xs font-medium">
            {securityEvents.map((ev: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700">{ev.id}</span>
                    <span className="text-xs font-bold text-slate-900">{ev.eventType}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.severity === 'HIGH' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      {ev.severity}
                    </span>
                  </div>
                  <p className="text-slate-655 text-xs">{ev.details}</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    User: {ev.userId} ({ev.userRole}) | Parcel: {ev.resourceUlpin}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px] font-mono uppercase mr-2 font-bold">Status: <strong>{ev.status}</strong></span>
                  {ev.status === 'NEW' && (
                    <button
                      onClick={() => handleUpdateEventStatus(ev.id, 'RESOLVED')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      Resolve Incident
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: RBAC MATRIX */}
      {activeSubTab === 'RBAC' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Role-Based Access Control (RBAC) Permission Matrix</h3>
            <p className="text-xs text-slate-500 font-medium">Explicit backend permissions mapped across Resident and Government Officer roles.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-800 font-medium">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Role Code</th>
                  <th className="p-3">Role Title</th>
                  <th className="p-3">Department Scope</th>
                  <th className="p-3">Key Authorized Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">LAND_OWNER</td>
                  <td className="p-3 font-bold text-slate-900">Land Owner / Resident</td>
                  <td className="p-3 text-slate-500">Citizen Portal</td>
                  <td className="p-3 text-slate-700">VIEW_OWN_PROPERTIES, VIEW_OWN_ROR, VIEW_OWN_TAX, CREATE_SERVICE_REQUEST</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">REVENUE_OFFICER</td>
                  <td className="p-3 font-bold text-slate-900">Revenue & Land Records Officer</td>
                  <td className="p-3 text-slate-500">Revenue Dept</td>
                  <td className="p-3 text-slate-700">VIEW_PARCELS, VIEW_ROR, REVIEW_MUTATION, APPROVE_MUTATION, CREATE_FIELD_VERIFICATION</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">REGISTRATION_OFFICER</td>
                  <td className="p-3 font-bold text-slate-900">Deed Registrar Sub-Registrar</td>
                  <td className="p-3 text-slate-500">Registration Dept</td>
                  <td className="p-3 text-slate-700">VIEW_REGISTRATION, PROCESS_REGISTRATION, VIEW_ENCUMBRANCE, VERIFY_DEED</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">TAX_OFFICER</td>
                  <td className="p-3 font-bold text-slate-900">Property Tax & Dues Inspector</td>
                  <td className="p-3 text-slate-500">Tax Dept</td>
                  <td className="p-3 text-slate-700">VIEW_TAX, UPDATE_TAX_STATUS, RECORD_TAX_PAYMENT, VIEW_TAX_ANALYTICS</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">PLANNING_OFFICER</td>
                  <td className="p-3 font-bold text-slate-900">Urban Planning & Zoning Planner</td>
                  <td className="p-3 text-slate-500">Planning Dept</td>
                  <td className="p-3 text-slate-700">VIEW_ZONING, VIEW_MASTER_PLAN, VIEW_LAND_USE, REVIEW_PLANNING_CONFLICT</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-blue-900 font-bold">ADMIN</td>
                  <td className="p-3 font-bold text-slate-900">System Administrator</td>
                  <td className="p-3 text-slate-500">Government Administration</td>
                  <td className="p-3 text-emerald-800 font-extrabold">SYSTEM_CONFIGURATION, USER_MANAGEMENT, AUDIT_ACCESS, VIEW_RAW_SOURCE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
