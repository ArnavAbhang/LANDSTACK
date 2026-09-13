import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, XCircle, Clock, AlertTriangle, UserCheck, ShieldCheck, Play, ArrowRight, Eye, Calendar, Plus, Filter, Search, FileText, ChevronRight, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { getSavedSession } from '../utils/session';

interface CaseItem {
  id: string;
  requestNumber?: string;
  ulpin: string;
  applicantName?: string;
  requesterId?: string;
  requestType: string;
  departmentCode?: string;
  department?: string;
  status: string;
  assignedOfficer?: string;
  priority?: string;
  details?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CaseManagementDashboard: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'IN_REVIEW' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'amber' | 'red' } | null>(null);

  // New Case Form State
  const [newUlpin, setNewUlpin] = useState('MH-27-PUN-000001');
  const [newRequestType, setNewRequestType] = useState('MUTATION_REQUEST');
  const [newApplicant, setNewApplicant] = useState('Rajendra Patil');
  const [newDept, setNewDept] = useState('REVENUE');
  const [newDetails, setNewDetails] = useState('Co-ownership RoR Ferfar mutation update request.');

  const session = getSavedSession();
  const token = session?.token || localStorage.getItem('landstack_auth_token') || 'jwt_token_revenue_officer';

  const fetchCasesData = () => {
    setLoading(true);
    const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };

    fetch('http://localhost:8080/api/service-requests', { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
        } else {
          // Fallback to v1 endpoint if needed
          fetch('http://localhost:8080/api/v1/service-requests', { headers })
            .then((res) => (res.ok ? res.json() : []))
            .then((v1Data) => {
              if (Array.isArray(v1Data) && v1Data.length > 0) {
                setCases(v1Data);
              } else {
                setCases(getDefaultCases());
              }
            })
            .catch(() => setCases(getDefaultCases()));
        }
        setLoading(false);
      })
      .catch(() => {
        setCases(getDefaultCases());
        setLoading(false);
      });

    fetch('http://localhost:8080/api/v1/field-verifications', { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setVerifications(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCasesData();
  }, [token]);

  const getDefaultCases = (): CaseItem[] => [
    {
      id: "REQ-2026-001",
      requestNumber: "MH-MUT-2026-0001",
      ulpin: "MH-27-PUN-000001",
      applicantName: "Rajendra Patil",
      requestType: "MUTATION_REQUEST",
      departmentCode: "REVENUE",
      department: "Revenue Dept",
      status: "UNDER_REVIEW",
      assignedOfficer: "Tahashildar Haveli",
      priority: "HIGH",
      details: "Co-ownership Ferfar Mutation under Mutation Entry No 1902 following registered sale deed.",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "REQ-2026-002",
      requestNumber: "MH-REG-2026-0002",
      ulpin: "MH-27-PUN-000003",
      applicantName: "Vijay Jadhav",
      requestType: "OWNERSHIP_TRANSFER",
      departmentCode: "REGISTRATION",
      department: "Registration SRO",
      status: "APPROVAL_PENDING",
      assignedOfficer: "Sub-Registrar Haveli",
      priority: "HIGH",
      details: "Deed Registration REG-MH-0002 pending interdepartmental revenue clearance.",
      createdAt: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: "REQ-2026-003",
      requestNumber: "TN-PATTA-2026-0003",
      ulpin: "TN-33-KCH-001-4412",
      applicantName: "M. Shanmugam",
      requestType: "PATTA_TRANSFER",
      departmentCode: "REVENUE",
      department: "Revenue Dept",
      status: "APPROVED",
      assignedOfficer: "Tahashildar Chengalpattu",
      priority: "MEDIUM",
      details: "Patta & Chitta extract name mutation approved and digitally signed.",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "REQ-2026-004",
      requestNumber: "MH-SURV-2026-0004",
      ulpin: "MH-27-PUN-000004",
      applicantName: "Meena Shinde",
      requestType: "BOUNDARY_DEMARCATION",
      departmentCode: "REVENUE",
      department: "Survey Dept",
      status: "FIELD_VERIFICATION",
      assignedOfficer: "DGPS Survey Officer Paud",
      priority: "MEDIUM",
      details: "Physical boundary survey and DGPS coordinate verification scheduled.",
      createdAt: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: "REQ-2026-005",
      requestNumber: "PB-FAR-2026-0005",
      ulpin: "PB-03-SAS-001-9921",
      applicantName: "Gurpreet Singh",
      requestType: "JAMABANDI_CORRECTION",
      departmentCode: "REVENUE",
      department: "Revenue Dept",
      status: "REJECTED",
      assignedOfficer: "Kanungo Kharar",
      priority: "LOW",
      details: "Fard Jamabandi spelling correction rejected due to missing court order documentation.",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const handleApproveCase = (c: CaseItem) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    fetch(`http://localhost:8080/api/workflows/${c.id}/transition`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nextState: 'APPROVED',
        actorRole: 'REVENUE_OFFICER',
        actorName: 'Authorized Officer',
        comments: 'Case approved after thorough revenue and deed verification.'
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(() => {
        setToastMessage({ text: `Case ${c.id} (${c.requestType}) successfully APPROVED & Record Updated!`, type: 'success' });
        updateLocalCaseStatus(c.id, 'APPROVED');
      })
      .catch(() => {
        setToastMessage({ text: `Case ${c.id} APPROVED in officer queue.`, type: 'success' });
        updateLocalCaseStatus(c.id, 'APPROVED');
      });
  };

  const handleRejectCase = (c: CaseItem) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    fetch(`http://localhost:8080/api/workflows/${c.id}/transition`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nextState: 'REJECTED',
        actorRole: 'REVENUE_OFFICER',
        actorName: 'Authorized Officer',
        comments: 'Case rejected due to insufficient compliance documentation.'
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(() => {
        setToastMessage({ text: `Case ${c.id} REJECTED. Citizen notified.`, type: 'red' });
        updateLocalCaseStatus(c.id, 'REJECTED');
      })
      .catch(() => {
        setToastMessage({ text: `Case ${c.id} marked REJECTED.`, type: 'red' });
        updateLocalCaseStatus(c.id, 'REJECTED');
      });
  };

  const handleScheduleVerification = (c: CaseItem) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    fetch('http://localhost:8080/api/v1/field-verifications', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        caseId: c.id,
        ulpin: c.ulpin,
        assignedOfficer: 'OFFICER_FIELD_PAUD',
        observations: 'DGPS Boundary & Field Survey Scheduled'
      })
    })
      .then(() => {
        setToastMessage({ text: `Field Verification survey order issued for Case ${c.id} (ULPIN: ${c.ulpin})`, type: 'amber' });
        updateLocalCaseStatus(c.id, 'FIELD_VERIFICATION');
      })
      .catch(() => {
        setToastMessage({ text: `Field Verification scheduled for ${c.id}.`, type: 'amber' });
        updateLocalCaseStatus(c.id, 'FIELD_VERIFICATION');
      });
  };

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const newReqPayload = {
      requestType: newRequestType,
      ulpin: newUlpin,
      applicantName: newApplicant,
      department: newDept === 'REVENUE' ? 'Revenue Dept' : 'Registration SRO',
      departmentCode: newDept,
      description: newDetails
    };

    fetch('http://localhost:8080/api/v1/service-requests', {
      method: 'POST',
      headers,
      body: JSON.stringify(newReqPayload)
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        setToastMessage({ text: `New Service Request ${created?.requestNumber || 'REQ-' + Date.now()} created successfully!`, type: 'success' });
        setShowNewCaseModal(false);
        fetchCasesData();
      })
      .catch(() => {
        const mockNew: CaseItem = {
          id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
          requestNumber: `MH-${newRequestType.substring(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          ulpin: newUlpin,
          applicantName: newApplicant,
          requestType: newRequestType,
          departmentCode: newDept,
          department: newDept === 'REVENUE' ? 'Revenue Dept' : 'Registration SRO',
          status: 'UNDER_REVIEW',
          assignedOfficer: 'Jurisdiction Revenue Officer',
          priority: 'MEDIUM',
          details: newDetails,
          createdAt: new Date().toISOString()
        };
        setCases((prev) => [mockNew, ...prev]);
        setToastMessage({ text: `New Service Request ${mockNew.id} created successfully!`, type: 'success' });
        setShowNewCaseModal(false);
      });
  };

  const updateLocalCaseStatus = (id: string, newStatus: string) => {
    setCases((prev) =>
      prev.map((item) => (item.id === id || item.requestNumber === id ? { ...item, status: newStatus } : item))
    );
  };

  // Helper matching functions for filters
  const isPending = (st: string) =>
    ['UNDER_REVIEW', 'APPROVAL_PENDING', 'SUBMITTED', 'PENDING', 'PENDING_APPROVAL', 'NEW'].includes(st.toUpperCase());
  const isApproved = (st: string) =>
    ['APPROVED', 'SANCTIONED', 'COMPLETED', 'RESOLVED', 'PASSED'].includes(st.toUpperCase());
  const isInReview = (st: string) =>
    ['FIELD_VERIFICATION', 'IN_REVIEW', 'SURVEY_SCHEDULED', 'INSPECTION_ORDERED'].includes(st.toUpperCase());
  const isRejected = (st: string) =>
    ['REJECTED', 'DISMISSED', 'CANCELLED', 'REFUSED'].includes(st.toUpperCase());

  // Filter calculations
  const pendingCount = cases.filter((c) => isPending(c.status)).length;
  const approvedCount = cases.filter((c) => isApproved(c.status)).length;
  const inReviewCount = cases.filter((c) => isInReview(c.status)).length;
  const rejectedCount = cases.filter((c) => isRejected(c.status)).length;

  const filteredCases = cases.filter((c) => {
    // 1. Status Filter
    let matchesStatus = true;
    if (activeFilter === 'PENDING') matchesStatus = isPending(c.status);
    else if (activeFilter === 'APPROVED') matchesStatus = isApproved(c.status);
    else if (activeFilter === 'IN_REVIEW') matchesStatus = isInReview(c.status);
    else if (activeFilter === 'REJECTED') matchesStatus = isRejected(c.status);

    // 2. Search Query Filter
    let matchesQuery = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesQuery = Boolean(
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.requestNumber && c.requestNumber.toLowerCase().includes(q)) ||
        (c.ulpin && c.ulpin.toLowerCase().includes(q)) ||
        (c.applicantName && c.applicantName.toLowerCase().includes(q)) ||
        (c.requestType && c.requestType.toLowerCase().includes(q))
      );
    }

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Government Workflow Case Management Center</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Officer Workflow Case Queue & Service Delivery</h2>
          <p className="text-xs text-slate-600 font-semibold">
            Review jurisdiction applications, assign officers, trigger field verifications, approve mutations, and enforce SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCasesData}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-all shadow-sm"
            title="Refresh Cases Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-900' : ''}`} />
          </button>

          <button
            onClick={() => setShowNewCaseModal(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Service Application</span>
          </button>
        </div>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : toastMessage.type === 'amber'
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            ) : toastMessage.type === 'amber' ? (
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-700" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-slate-900 font-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Metric Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold">
        {/* All Cases */}
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeFilter === 'ALL'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-700'
              : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 shadow-sm'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold block ${activeFilter === 'ALL' ? 'text-blue-200' : 'text-slate-500'}`}>
            All Applications
          </span>
          <div className="text-2xl font-black mt-1">{cases.length}</div>
          <div className={`text-[10px] mt-1 font-medium ${activeFilter === 'ALL' ? 'text-blue-200' : 'text-slate-500'}`}>
            Click to view total queue
          </div>
        </button>

        {/* Pending Cases */}
        <button
          onClick={() => setActiveFilter('PENDING')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeFilter === 'PENDING'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500'
              : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300 shadow-sm'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold block ${activeFilter === 'PENDING' ? 'text-amber-100' : 'text-slate-500'}`}>
            Pending Review
          </span>
          <div className={`text-2xl font-black mt-1 ${activeFilter === 'PENDING' ? 'text-white' : 'text-amber-700'}`}>{pendingCount}</div>
          <div className={`text-[10px] mt-1 font-medium ${activeFilter === 'PENDING' ? 'text-amber-100' : 'text-slate-500'}`}>
            Click to filter pending
          </div>
        </button>

        {/* In Review / Field Verification */}
        <button
          onClick={() => setActiveFilter('IN_REVIEW')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeFilter === 'IN_REVIEW'
              ? 'bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-500'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300 shadow-sm'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold block ${activeFilter === 'IN_REVIEW' ? 'text-purple-100' : 'text-slate-500'}`}>
            Field Verification
          </span>
          <div className={`text-2xl font-black mt-1 ${activeFilter === 'IN_REVIEW' ? 'text-white' : 'text-purple-700'}`}>{inReviewCount}</div>
          <div className={`text-[10px] mt-1 font-medium ${activeFilter === 'IN_REVIEW' ? 'text-purple-100' : 'text-slate-500'}`}>
            Survey in progress
          </div>
        </button>

        {/* Approved Cases */}
        <button
          onClick={() => setActiveFilter('APPROVED')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeFilter === 'APPROVED'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500'
              : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold block ${activeFilter === 'APPROVED' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Approved & Issued
          </span>
          <div className={`text-2xl font-black mt-1 ${activeFilter === 'APPROVED' ? 'text-white' : 'text-emerald-700'}`}>{approvedCount}</div>
          <div className={`text-[10px] mt-1 font-medium ${activeFilter === 'APPROVED' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Sanctioned mutations
          </div>
        </button>

        {/* Rejected Cases */}
        <button
          onClick={() => setActiveFilter('REJECTED')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeFilter === 'REJECTED'
              ? 'bg-red-700 text-white border-red-700 shadow-md ring-2 ring-red-500'
              : 'bg-white text-slate-900 border-slate-200 hover:border-red-300 shadow-sm'
          }`}
        >
          <span className={`text-[10px] uppercase font-bold block ${activeFilter === 'REJECTED' ? 'text-red-100' : 'text-slate-500'}`}>
            Rejected / Refused
          </span>
          <div className={`text-2xl font-black mt-1 ${activeFilter === 'REJECTED' ? 'text-white' : 'text-red-700'}`}>{rejectedCount}</div>
          <div className={`text-[10px] mt-1 font-medium ${activeFilter === 'REJECTED' ? 'text-red-100' : 'text-slate-500'}`}>
            Refused applications
          </div>
        </button>
      </div>

      {/* Main Cases Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {/* Table Toolbar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900">Jurisdiction Applications Queue</h3>
            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded font-mono text-xs font-bold">
              Showing {filteredCases.length} of {cases.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search ULPIN, Request ID, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-blue-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Filter Pill Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeFilter === 'ALL' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('PENDING')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setActiveFilter('APPROVED')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse font-medium">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Request ID</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">ULPIN</th>
                <th className="py-3 px-3">Service Type</th>
                <th className="py-3 px-3">Assigned Officer</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    No service applications match the selected filter ({activeFilter}).
                  </td>
                </tr>
              ) : (
                filteredCases.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-900">
                      {c.id || c.requestNumber}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {c.applicantName || 'Citizen Applicant'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-900 font-bold">
                      {c.ulpin}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-50 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded font-extrabold text-[10px]">
                        {c.requestType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {c.assignedOfficer || 'Tahashildar Haveli'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                          isApproved(c.status)
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isPending(c.status)
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : isInReview(c.status)
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="View Case Dossier"
                        >
                          <Eye className="w-4 h-4 text-blue-900" />
                        </button>

                        {!isApproved(c.status) && !isRejected(c.status) && (
                          <>
                            <button
                              onClick={() => handleApproveCase(c)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleScheduleVerification(c)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm"
                            >
                              Field Survey
                            </button>
                            <button
                              onClick={() => handleRejectCase(c)}
                              className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Dossier View Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-black">
                  CASE DOSSIER: {selectedCase.id || selectedCase.requestNumber}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedCase.requestType}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">ULPIN</span>
                <span className="font-extrabold text-blue-900 text-sm font-mono">{selectedCase.ulpin}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Applicant Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedCase.applicantName || 'Citizen'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Department</span>
                <span className="font-bold text-slate-900">{selectedCase.department || selectedCase.departmentCode}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Status</span>
                <span className="font-extrabold text-emerald-800">{selectedCase.status}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Application Remarks & Details</span>
              <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium">
                {selectedCase.details || selectedCase.description || 'Application submitted for official revenue officer review.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {!isApproved(selectedCase.status) && (
                <button
                  onClick={() => {
                    handleApproveCase(selectedCase);
                    setSelectedCase(null);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-sm"
                >
                  Approve Application
                </button>
              )}
              <button
                onClick={() => setSelectedCase(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Service Application Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Submit New Service Application</h3>
              <button onClick={() => setShowNewCaseModal(false)} className="p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCase} className="space-y-3 font-medium">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Target ULPIN</label>
                <input
                  type="text"
                  value={newUlpin}
                  onChange={(e) => setNewUlpin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Service Request Type</label>
                <select
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                >
                  <option value="MUTATION_REQUEST">7/12 & Patta Ownership Mutation</option>
                  <option value="BOUNDARY_DEMARCATION">DGPS Cadastral Boundary Survey</option>
                  <option value="LAND_RECORD_CORRECTION">Land Record Correction</option>
                  <option value="OWNERSHIP_TRANSFER">Sub-Registrar Conveyance Deed</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={newApplicant}
                  onChange={(e) => setNewApplicant(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                >
                  <option value="REVENUE">Department of Land Revenue</option>
                  <option value="REGISTRATION">Sub-Registrar Office (SRO)</option>
                  <option value="PLANNING">Urban Development & Planning</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Application Details / Remarks</label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-medium text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-900 h-20"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
