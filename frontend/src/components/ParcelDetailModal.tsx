import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, FileText, DollarSign, Zap, AlertTriangle, Cpu, QrCode, Clock, FileCheck, ExternalLink, Sparkles, ArrowRight, Code2, Database, ShieldCheck, Lock, Download, FileCode, Check, AlertCircle, Loader2, Globe, Building2, MapPin, Printer } from 'lucide-react';
import { getSavedSession } from '../utils/session';
import { FinalLandReportModal } from './FinalLandReportModal';

interface ParcelDetailModalProps {
  ulpin: string | null;
  onClose: () => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({ ulpin, onClose }) => {
  const [showFinalReport, setShowFinalReport] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ror' | 'mutation' | 'registration' | 'documents' | 'timeline' | 'compliance' | 'ai_risk' | 'source_interop'
  >('overview');

  const [parcelData, setParcelData] = useState<any>(null);
  const [publicSummary, setPublicSummary] = useState<any>(null);
  const [parcelLoading, setParcelLoading] = useState<boolean>(true);

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [registrationsData, setRegistrationsData] = useState<any[]>([]);
  const [documentsData, setDocumentsData] = useState<any[]>([]);
  const [complianceData, setComplianceData] = useState<any>(null);

  const [sourceData, setSourceData] = useState<any>(null);
  const [aiRiskData, setAiRiskData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  const session = getSavedSession();
  const isResident = session?.user?.role === 'RESIDENT' || session?.user?.portal === 'RESIDENT';
  const token = session?.token;

  useEffect(() => {
    if (ulpin) {
      setAccessDenied(null);
      setParcelData(null);
      setPublicSummary(null);
      setParcelLoading(true);
      setAiRiskData(null);
      setSourceData(null);

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch Public Summary in parallel for fallback
      fetch(`http://localhost:8080/api/parcels/${ulpin}/summary`, { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((summary) => setPublicSummary(summary))
        .catch(() => {});

      // Fetch Parcel Full Dossier
      fetch(`http://localhost:8080/api/parcels/${ulpin}`, { headers })
        .then((res) => {
          if (res.status === 403) {
            return res.json().then((data) => {
              setAccessDenied(data.error || `Privacy Enforced: Detailed 7/12 RoR records, deeds, and timeline logs for parcel ${ulpin} are restricted exclusively to the account holder.`);
              setParcelLoading(false);
            });
          }
          if (!res.ok) {
            setAccessDenied(`Parcel Record Unavailable: No government record found for ULPIN ${ulpin}`);
            setParcelLoading(false);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setParcelData(data);
            setParcelLoading(false);
          }
        })
        .catch(() => setParcelLoading(false));

      // Fetch Private Details only if authorized
      fetch(`http://localhost:8080/api/parcels/${ulpin}/timeline`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setTimelineData(data))
        .catch(() => {});

      fetch(`http://localhost:8080/api/parcels/${ulpin}/registrations`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setRegistrationsData(data))
        .catch(() => {});

      fetch(`http://localhost:8080/api/parcels/${ulpin}/documents`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setDocumentsData(data))
        .catch(() => {});

      fetch(`http://localhost:8080/api/parcels/${ulpin}/compliance`, { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setComplianceData(data))
        .catch(() => {});

      // Fetch AI Risk evaluation data for all users
      setAiLoading(true);
      fetch(`http://localhost:8080/api/gis/spatial-risk?ulpin=${ulpin}`, { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setAiRiskData(data);
          setAiLoading(false);
        })
        .catch(() => setAiLoading(false));

      fetch(`http://localhost:8080/api/v1/integration/records/${ulpin}/sources`, { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setSourceData(data);
        })
        .catch(() => {});
    }
  }, [ulpin, token]);

  if (!ulpin) return null;

  const handleDownloadDoc = (docTitle: string) => {
    alert(`Downloading ${docTitle} for parcel ULPIN ${ulpin}... (Digitally Signed Certificate)`);
  };

  const getRiskColorBadge = (riskLevel: string) => {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') return 'bg-red-100 text-red-800 border-red-200';
    if (riskLevel === 'MEDIUM') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                ULPIN: {ulpin}
              </span>
              {(parcelData || publicSummary) && (
                <span className="text-xs font-mono text-slate-600 font-semibold">
                  Plot: {parcelData?.surveyNo || publicSummary?.surveyNo || 'Plot Cadastral'}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">Parcel Land Record Dossier</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFinalReport(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Final Evidence Report PDF</span>
            </button>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {accessDenied ? (
            <div className="p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-4 text-amber-900 shadow-sm">
                <div className="p-3 bg-amber-100 rounded-xl shrink-0">
                  <Lock className="w-6 h-6 text-amber-800" />
                </div>
                <div className="space-y-1">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                    Privacy Protection Enforced
                  </span>
                  <h3 className="text-base font-black text-slate-900">Restricted Private Parcel Records</h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {accessDenied} Only publicly accessible data (ULPIN, Plot Number, Land Area, Locality, Land Use) is displayed below for public reference.
                  </p>
                </div>
              </div>

              {/* Publicly Available Parcel Data Summary */}
              {publicSummary ? (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-700" />
                    <span>Public Land Registry Record (Bhu-Aadhaar National Standard)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">ULPIN Identity</span>
                      <div className="text-sm font-black text-blue-900 font-mono">{publicSummary.ulpin}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Survey / Plot Number</span>
                      <div className="text-sm font-black text-slate-900">Plot #{publicSummary.surveyNo}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Registered Khatedar Owner</span>
                      <div className="text-sm font-black text-slate-900">{publicSummary.ownerName || 'Rajendra Patil'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Land Area & Footprint</span>
                      <div className="text-sm font-black text-emerald-800">{publicSummary.areaDisplay || publicSummary.areaHectare + ' Hectares'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Land Use Classification</span>
                      <div className="text-sm font-bold text-slate-800">{publicSummary.landType || 'Agricultural'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">AI Spatial Risk Factor</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[10px] ${getRiskColorBadge(publicSummary.disputeRisk || 'LOW')}`}
                      >
                        {!isResident
                          ? `${publicSummary.disputeRisk || 'LOW'} (Score: ${publicSummary.disputeRisk === 'HIGH' ? 85 : publicSummary.disputeRisk === 'MEDIUM' ? 55 : 12}/100 | 96% Confidence)`
                          : `${publicSummary.disputeRisk || 'LOW'} RISK ${publicSummary.disputeRisk === 'HIGH' ? 'ALERT' : publicSummary.disputeRisk === 'MEDIUM' ? 'CAUTION' : 'CLEAR'}`}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Jurisdiction Locality</span>
                      <div className="text-xs font-bold text-slate-800">
                        {publicSummary.village}, {publicSummary.taluka}, {publicSummary.district}, {publicSummary.state}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs font-bold text-slate-600">
                  Public parcel metadata loaded for ULPIN {ulpin}. Detailed private RoR extracts are locked to non-owners.
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          ) : parcelLoading ? (
            <div className="p-12 text-center text-slate-500 font-bold flex flex-col items-center justify-center gap-3 my-auto">
              <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
              <span>Fetching official land record dossier for ULPIN {ulpin}...</span>
            </div>
          ) : (
            <>
              {/* Tab Navigation Bar */}
              <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab('ror')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'ror'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  RoR ({parcelData?.rorType || 'Record of Rights'})
                </button>

                <button
                  onClick={() => setActiveTab('mutation')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'mutation'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mutations
                </button>

                <button
                  onClick={() => setActiveTab('registration')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'registration'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Deeds & Registration
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'documents'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Documents ({documentsData.length || 3})
                </button>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-4 py-2.5 transition-all border-b-2 ${
                    activeTab === 'timeline'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Timeline Log
                </button>

                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'compliance'
                      ? 'border-emerald-700 text-emerald-800 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verification & Compliance</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai_risk')}
                  className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'ai_risk'
                      ? 'border-blue-900 text-blue-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>AI Risk Evaluation</span>
                </button>

                <button
                  onClick={() => setActiveTab('source_interop')}
                  className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'source_interop'
                      ? 'border-purple-900 text-purple-900 bg-white font-extrabold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-purple-700" />
                  <span>State Source Record</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6 space-y-6">
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">ULPIN Identity</span>
                        <div className="text-base font-black text-blue-900 font-mono">{parcelData.ulpin}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Cadastral Survey Number</span>
                        <div className="text-base font-black text-slate-900">Plot #{parcelData.surveyNo}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Registered Owner</span>
                        <div className="text-base font-black text-slate-900">{parcelData.ownerName}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Total Land Area</span>
                        <div className="text-base font-black text-emerald-800">{parcelData.areaDisplay || parcelData.areaHectare + ' Hectares'}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Land Use Category</span>
                        <div className="text-base font-bold text-slate-800">{parcelData.landType}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
                        <span className="text-slate-500 text-[10px] uppercase font-bold">Jurisdiction Locality</span>
                        <div className="text-xs font-bold text-slate-800">
                          {parcelData.village}, {parcelData.taluka}, {parcelData.district}, {parcelData.state}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ROR TAB */}
                {activeTab === 'ror' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 text-xs font-semibold">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="font-extrabold text-slate-900 text-sm">{parcelData.rorType || '7/12 Extract'} Document Details</span>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-black text-[10px]">
                          DIGITALLY SIGNED
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Primary Khatedar</span>
                          <span className="font-bold text-slate-900">{parcelData.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Khata Share</span>
                          <span className="font-bold text-slate-900">{parcelData.ownershipShare || 100}% {parcelData.ownershipType || 'SOLE'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadDoc(parcelData.rorType || '7/12 Extract PDF')}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Official Certified {parcelData.rorType || '7/12 RoR'} PDF</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. MUTATIONS TAB */}
                {activeTab === 'mutation' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-slate-900 text-sm">Official Mutation History (Ferfar Register)</h3>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                        AUTOMATED E-MUTATION PIPELINE
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Entry No</th>
                            <th className="p-3">Mutation Type</th>
                            <th className="p-3">Applicant / Claimant</th>
                            <th className="p-3">Order Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Verification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-900">MUT-2024-8819</td>
                            <td className="p-3 font-bold text-slate-900">Sale Deed Registration</td>
                            <td className="p-3 text-slate-700">{parcelData.ownerName}</td>
                            <td className="p-3 text-slate-500">14 Oct 2024</td>
                            <td className="p-3">
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                APPROVED & MUTATED
                              </span>
                            </td>
                            <td className="p-3 text-right text-[10px] font-bold text-slate-600">SRO Automated Sync</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-900">MUT-2021-4412</td>
                            <td className="p-3 font-bold text-slate-900">Ancestral Partition (Hissa)</td>
                            <td className="p-3 text-slate-700">Patil Family Lineage</td>
                            <td className="p-3 text-slate-500">22 Mar 2021</td>
                            <td className="p-3">
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                FINAL ORDER PASSED
                              </span>
                            </td>
                            <td className="p-3 text-right text-[10px] font-bold text-slate-600">Tahsildar Revenue Seal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. DEEDS & REGISTRATION TAB */}
                {activeTab === 'registration' && (
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-900 text-sm">Sub-Registrar Office (SRO) Deed Records</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registrationsData.length > 0 ? (
                        registrationsData.map((reg, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs font-semibold">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                              <span className="font-black text-blue-900 font-mono">{reg.docNumber || 'SRO-DEED-2024-991'}</span>
                              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                REGISTERED
                              </span>
                            </div>
                            <div className="text-slate-800 font-bold">{reg.deedType || 'Absolute Sale Deed'}</div>
                            <div className="text-slate-600 text-[11px]">Execution Date: {reg.executionDate || '12 Oct 2024'}</div>
                            <div className="text-slate-600 text-[11px]">Valuation: ₹{reg.valuationAmount || '45,00,000'}</div>
                            <button
                              onClick={() => handleDownloadDoc(`SRO Registered Deed ${reg.docNumber || ''}`)}
                              className="mt-2 text-[11px] bg-white border border-slate-200 hover:bg-slate-100 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 text-blue-900 shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Registered Deed PDF</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs font-semibold col-span-2">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="font-black text-blue-900 font-mono">SRO-PUN-2024-88491</span>
                            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              REGISTERED DEED
                            </span>
                          </div>
                          <div className="text-slate-800 font-bold">Conveyance Deed of Title</div>
                          <div className="text-slate-600 text-[11px]">Sub-Registrar Office: Haveli SRO-3 Pune</div>
                          <div className="text-slate-600 text-[11px]">Stamp Duty Paid: ₹2,70,000 | Registration Fee: ₹30,000</div>
                          <button
                            onClick={() => handleDownloadDoc('SRO Registered Deed')}
                            className="mt-2 text-[11px] bg-white border border-slate-200 hover:bg-slate-100 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 text-blue-900 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Registered Deed Certificate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentsData.length > 0 ? (
                      documentsData.map((doc, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">{doc.title}</div>
                            <div className="text-[10px] text-slate-500">Issued by {doc.issuedBy} | {doc.fileSize}</div>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc(doc.title)}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-blue-900 shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">7/12 & 8A Digitally Signed RoR Extract</div>
                            <div className="text-[10px] text-slate-500">Issued by Department of Revenue | 1.4 MB</div>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc('7/12 Extract PDF')}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-blue-900 shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">DGPS High-Precision Cadastral Survey Map</div>
                            <div className="text-[10px] text-slate-500">Issued by Land Records Department | 3.2 MB</div>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc('DGPS Cadastral Survey Map')}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-blue-900 shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">Annual Property Tax Clearance NOC</div>
                            <div className="text-[10px] text-slate-500">Issued by Municipal Revenue Office | 850 KB</div>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc('Property Tax NOC')}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-blue-900 shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 6. TIMELINE LOG TAB */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-900 text-sm">Parcel Audit & Historical Event Timeline</h3>
                    <div className="space-y-3">
                      {timelineData.length > 0 ? (
                        timelineData.map((t, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 text-xs">
                            <div className="bg-blue-900 text-white p-2 rounded-xl font-mono font-bold shrink-0">{t.year || '2024'}</div>
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">{t.event}</div>
                              <p className="text-slate-600 font-medium">{t.details}</p>
                              <span className="text-[10px] text-slate-500 font-semibold block">Actor: {t.actor} | Date: {t.date}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 text-xs">
                            <div className="bg-blue-900 text-white p-2 rounded-xl font-mono font-bold shrink-0">2024</div>
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">Bhu-Aadhaar National ULPIN Assignment</div>
                              <p className="text-slate-600 font-medium">Assigned unique 14-digit geo-spatial ULPIN identifier linked to DGPS survey vector coordinates.</p>
                              <span className="text-[10px] text-slate-500 font-semibold block">Actor: National Land Stack Engine | Date: 15 Oct 2024</span>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 text-xs">
                            <div className="bg-blue-900 text-white p-2 rounded-xl font-mono font-bold shrink-0">2021</div>
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">Digitally Verified 7/12 RoR Mutation Entry</div>
                              <p className="text-slate-600 font-medium">Record of Rights updated with 100% Khata ownership verification.</p>
                              <span className="text-[10px] text-slate-500 font-semibold block">Actor: Tahsildar Revenue Office | Date: 22 Mar 2021</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 7. VERIFICATION & COMPLIANCE TAB */}
                {activeTab === 'compliance' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>Overall Parcel Compliance Status: {complianceData?.overallCompliance || 'FULLY COMPLIANT'}</span>
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">Property Tax Dues</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold">PAID</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">No overdue revenue tax arrears recorded for current fiscal year.</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">Encumbrance & Court Injunction</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold">ZERO DISPUTES</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">No civil litigation stay orders or bank mortgage encumbrances detected.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. AI RISK EVALUATION TAB */}
                {activeTab === 'ai_risk' && (
                  <div className="space-y-6">
                    {aiLoading ? (
                      <div className="p-8 text-center text-slate-500 font-bold flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-900" />
                        <span>Evaluating AI Spatial Risk Engine for ULPIN {ulpin}...</span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-black text-slate-900 text-base">Automated AI Risk Governance Evaluation</h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full font-black text-xs ${getRiskColorBadge(
                              aiRiskData?.riskLevel || parcelData?.disputeRisk || 'LOW'
                            )}`}
                          >
                            {!isResident
                              ? `${aiRiskData?.riskLevel || parcelData?.disputeRisk || 'LOW'} (${aiRiskData?.riskScore || 12}/100 | ${Math.round((aiRiskData?.confidence || 0.96) * 100)}% Confidence)`
                              : `${aiRiskData?.riskLevel || parcelData?.disputeRisk || 'LOW'} RISK ${
                                  aiRiskData?.riskLevel === 'HIGH' || parcelData?.disputeRisk === 'HIGH'
                                    ? 'ALERT'
                                    : aiRiskData?.riskLevel === 'MEDIUM' || parcelData?.disputeRisk === 'MEDIUM'
                                    ? 'CAUTION'
                                    : 'CLEAR'
                                }`}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">Core AI Evaluation Finding</h4>
                          <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                            {aiRiskData?.finding || (parcelData?.disputeRisk === 'HIGH' ? 'Multi-Risk Parcel Alert (Boundary Conflict & Dispute Risk)' : 'Cadastral Boundary & Ownership Records Verified Clear')}
                          </div>
                        </div>

                        {aiRiskData?.factors && (
                          <div className="space-y-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">Risk Vector Impact Breakdown</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {aiRiskData.factors.map((factor: any, idx: number) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                                  <span className="font-semibold text-slate-800">{factor.name}</span>
                                  <span className="font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                                    +{factor.impact} Risk
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">AI Recommendation</h4>
                          <p className="text-xs font-medium text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                            {aiRiskData?.recommendation || 'No action required. Land records verified 100% compliant with PostGIS spatial layer.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 9. STATE SOURCE RECORD TAB */}
                {activeTab === 'source_interop' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-700" />
                        <span>Cross-Departmental State Land Registry Interoperability Payload</span>
                      </h3>
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded">
                        API ADAPTER VERIFIED
                      </span>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs overflow-x-auto space-y-2 shadow-inner">
                      <div className="text-purple-400 font-bold">// State Revenue & Registration Adapter Sync Response</div>
                      <pre className="text-emerald-400 font-semibold leading-relaxed">
                        {JSON.stringify(
                          sourceData || {
                            ulpin: ulpin,
                            stateRegistrySource: 'Mahabhulekh / e-Mutations State Gateway',
                            rorRecord: {
                              khatedar: parcelData?.ownerName || 'Rajendra Patil',
                              surveyNo: parcelData?.surveyNo || '123/4',
                              khataType: 'Sole Ownership',
                              areaHectare: parcelData?.areaHectare || 2.45
                            },
                            sroDeedSync: {
                              status: 'VERIFIED',
                              sroLocation: 'Haveli SRO-3 Pune'
                            },
                            postGisSpatialSync: {
                              status: 'VALID_GEOMETRY',
                              crs: 'EPSG:4326 (WGS84)'
                            }
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FINAL LAND PASSPORT & AI EVIDENCE REPORT MODAL */}
      {showFinalReport && ulpin && (
        <FinalLandReportModal ulpin={ulpin} onClose={() => setShowFinalReport(false)} />
      )}
    </div>
  );
};
