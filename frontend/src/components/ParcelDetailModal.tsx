import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, FileText, DollarSign, Zap, AlertTriangle, Cpu, QrCode, Clock, FileCheck, ExternalLink, Sparkles, ArrowRight, Code2, Database, ShieldCheck } from 'lucide-react';

interface ParcelDetailModalProps {
  ulpin: string | null;
  onClose: () => void;
}

export const ParcelDetailModal: React.FC<ParcelDetailModalProps> = ({ ulpin, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ror' | 'mutation' | 'registration' | 'financials' | 'disputes' | 'documents' | 'timeline' | 'ai_risk' | 'source_interop'>('overview');
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any>(null);
  const [canonicalData, setCanonicalData] = useState<any>(null);
  const [aiRiskData, setAiRiskData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(true);

  useEffect(() => {
    if (ulpin) {
      setAiLoading(true);
      setAiRiskData(null); // Clear stale previous parcel AI results immediately!

      fetch(`http://localhost:8080/api/ai/parcel-risk/${ulpin}`)
        .then((res) => res.json())
        .then((data) => {
          setAiRiskData(data);
          setAiLoading(false);
        })
        .catch(() => {
          setAiLoading(false);
        });

      fetch(`http://localhost:8080/api/parcels/${ulpin}/timeline`)
        .then((res) => res.json())
        .then((data) => setTimelineData(data))
        .catch(() => {});

      fetch(`http://localhost:8080/api/v1/integration/records/${ulpin}/sources`)
        .then((res) => res.json())
        .then((data) => setSourceData(data))
        .catch(() => {});

      fetch(`http://localhost:8080/api/v1/integration/records/${ulpin}/canonical`)
        .then((res) => res.json())
        .then((data) => setCanonicalData(data))
        .catch(() => {});
    }
  }, [ulpin]);

  if (!ulpin) return null;

  const isMaharashtra = !ulpin.toUpperCase().includes("TN") && !ulpin.toUpperCase().includes("PB");
  const isTamilNadu = ulpin.toUpperCase().includes("TN");
  const isPunjab = ulpin.toUpperCase().includes("PB");
  const isMultiRisk = ulpin.includes("000003") || ulpin.includes("MH-000003");

  const parcelData = {
    ulpin: ulpin,
    stateParcelId: isTamilNadu ? "TN-KCH-CHE-SRI-PATTA-1082" : (isPunjab ? "PB-ASR-JMB-402" : "MH-PUN-HAV-PAUD-125/1"),
    state: isTamilNadu ? "Tamil Nadu" : (isPunjab ? "Punjab" : "Maharashtra"),
    district: isTamilNadu ? "Kanchipuram" : (isPunjab ? "Amritsar" : "Pune"),
    taluka: isTamilNadu ? "Chengalpattu" : (isPunjab ? "Ajnala" : "Haveli"),
    village: isTamilNadu ? "Sriperumbudur" : (isPunjab ? "Ajnala" : "Paud"),
    surveyNumber: isTamilNadu ? "201/1A" : (isPunjab ? "88/1" : "125/1"),
    areaDisplay: isTamilNadu ? "4.00 Acres (Nanjai)" : (isPunjab ? "16 Kanal (0.81 Ha)" : "3.10 Hectares"),
    ownerName: isTamilNadu ? "M. Shanmugam" : (isPunjab ? "Gurpreet Singh" : "Vijay Jadhav"),
    landType: isTamilNadu ? "Agricultural (Nanjai)" : (isPunjab ? "Chahi (Irrigated)" : "Agricultural"),
    rorType: isTamilNadu ? "Patta & Chitta Extract" : (isPunjab ? "Jamabandi Fard" : "7/12 & 8A Extract"),
    taxStatus: isMultiRisk ? "OVERDUE" : "PAID",
    taxDues: isMultiRisk ? 8000.0 : 0.0,
    disputeRisk: isMultiRisk ? "HIGH" : "LOW",
    disputeSummary: isMultiRisk ? "Civil Suit CS/2024/9912 - Boundary overlap claim of 130 m²" : "No active civil litigation"
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                ULPIN: {parcelData.ulpin}
              </span>
              <span className="text-xs font-mono text-slate-600 font-semibold">
                State ID: {parcelData.stateParcelId}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Parcel Land Record & Governance Dossier
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'overview' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('ror')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'ror' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            RoR ({parcelData.rorType})
          </button>

          <button
            onClick={() => setActiveTab('mutation')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'mutation' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Mutations
          </button>

          <button
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'registration' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Deeds & Registration
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'financials' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tax & Dues
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'disputes' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Litigation & Disputes
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'documents' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Documents
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'timeline' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline Log
          </button>

          <button
            onClick={() => setActiveTab('ai_risk')}
            className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ai_risk' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>AI Risk Assessment</span>
          </button>

          <button
            onClick={() => setActiveTab('source_interop')}
            className={`px-4 py-2.5 transition-all border-b-2 ${
              activeTab === 'source_interop' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Source vs Canonical
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 text-base">Primary Cadastral Attributes</h3>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-extrabold">
                    CANONICAL VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">State Jurisdiction</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">District</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Taluka / Sub-Division</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.taluka}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Village Locality</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.village}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Survey Plot #</span>
                    <span className="font-extrabold text-blue-900 text-sm font-mono">{parcelData.surveyNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Cadastral Area</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.areaDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Primary Khatedar Owner</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Land Classification</span>
                    <span className="font-extrabold text-slate-900 text-sm">{parcelData.landType}</span>
                  </div>
                </div>
              </div>

              {/* Ownership Structure */}
              <div className="border border-slate-200 p-5 rounded-2xl space-y-3 bg-white">
                <div className="font-black text-slate-900 text-xs uppercase tracking-wider text-blue-900">
                  Ownership & Encumbrance Status
                </div>
                <div className="space-y-2 font-medium">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">{parcelData.ownerName}</div>
                      <div className="text-slate-500 text-[11px]">Person ID: LS-PER-00000125</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        100% SOLE KHATEDAR
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROR TAB */}
          {activeTab === 'ror' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Record of Rights (RoR) Details</div>
                <p>Owner Name: <strong className="text-slate-900">{parcelData.ownerName}</strong></p>
                <p>Survey Number: <strong className="text-slate-900">{parcelData.surveyNumber}</strong></p>
                <p>Area Extent: <strong className="text-slate-900">{parcelData.areaDisplay}</strong></p>
                <p>Land Type/Category: <strong className="text-slate-900">{parcelData.landType}</strong></p>
              </div>
            </div>
          )}

          {/* MUTATIONS TAB */}
          {activeTab === 'mutation' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Active Mutation Applications</div>
                <p>No active pending mutations for this parcel ULPIN.</p>
              </div>
            </div>
          )}

          {/* REGISTRATION TAB */}
          {activeTab === 'registration' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Stamp Duty & Deed Details</div>
                <p>Registrar Office: <strong className="text-slate-900">Sub-Registrar Office Haveli</strong></p>
                <p>Last Registered Deed Number: <strong className="text-slate-900">REG-PUN-2020-0192</strong></p>
              </div>
            </div>
          )}

          {/* TAX & FINANCIALS TAB */}
          {activeTab === 'financials' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Property Tax & Dues Clearance</div>
                <p>Tax Status: <strong className={parcelData.taxStatus === 'PAID' ? "text-emerald-700 font-extrabold" : "text-amber-700 font-extrabold"}>{parcelData.taxStatus}</strong></p>
                {parcelData.taxDues > 0 && <p>Outstanding Dues: <strong className="text-red-700 font-extrabold">₹{parcelData.taxDues}</strong></p>}
              </div>
            </div>
          )}

          {/* DISPUTES TAB */}
          {activeTab === 'disputes' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Litigation & Boundary Claims</div>
                <p>Status: <strong className={parcelData.disputeRisk === 'HIGH' ? "text-red-700 font-extrabold" : "text-emerald-700 font-extrabold"}>{parcelData.disputeRisk === 'HIGH' ? "LITIGATION_ACTIVE" : "CLEAR"}</strong></p>
                <p>Summary: <span className="text-slate-700">{parcelData.disputeSummary}</span></p>
              </div>
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Digitally Signed Certificates</div>
                <p>Verified certificates and PDFs are available in the resident portal.</p>
              </div>
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 font-medium">
                <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Historical Version Registry Timeline</div>
                {timelineData && timelineData.length > 0 ? (
                  timelineData.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-blue-900 pl-4 py-1 space-y-1">
                      <div className="font-bold text-slate-900 text-xs">{item.actionType}</div>
                      <div className="text-slate-500 text-[10px] font-mono">{item.timestamp?.replace('T', ' ')}</div>
                      <p className="text-[11px] text-slate-600 font-semibold">Changed By: {item.changedBy} | Notes: {item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No timeline data available for this ULPIN.</p>
                )}
              </div>
            </div>
          )}

          {/* SOURCE VS CANONICAL TAB */}
          {activeTab === 'source_interop' && (
            <div className="space-y-6 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-700" />
                    <span>State Source Truth vs. Normalized Canonical Representation</span>
                  </h3>
                  <button
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="text-xs bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 font-bold shadow-sm"
                  >
                    {showRawJson ? 'Hide Raw Source Payload' : 'Expand Raw Source Payload'}
                  </button>
                </div>
                <p className="text-slate-600 font-medium">
                  Demonstrates that the original state source record ({parcelData.state}) is preserved 100% untouched while converting fields into the canonical Land Stack model.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Raw State Source Payload */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="font-bold text-amber-700 flex items-center justify-between border-b border-slate-200 pb-2">
                    <span>Original State Source Payload (Raw JSON)</span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">State: {parcelData.state}</span>
                  </div>
                  <pre className="bg-white border border-slate-200 p-3 rounded-lg text-emerald-800 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[300px] shadow-sm">
                    {JSON.stringify(sourceData?.rawSourcePayload || {
                      stateCode: isTamilNadu ? "TN" : (isPunjab ? "PB" : "MH"),
                      documentType: parcelData.rorType,
                      surveyNumber: parcelData.surveyNumber,
                      ownerName: parcelData.ownerName,
                      areaDisplay: parcelData.areaDisplay
                    }, null, 2)}
                  </pre>
                </div>

                {/* Normalized Canonical Entity */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="font-bold text-blue-900 flex items-center justify-between border-b border-slate-200 pb-2">
                    <span>Normalized Canonical Entity (Land Stack)</span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">Canonical Schema v1.0.0</span>
                  </div>
                  <div className="space-y-2 text-slate-800 text-[11px] bg-white p-3 rounded-lg border border-slate-200 shadow-sm font-medium">
                    <p><span className="text-slate-500">ULPIN Anchor:</span> <strong className="text-blue-900 font-mono">{parcelData.ulpin}</strong></p>
                    <p><span className="text-slate-500">Canonical Owner:</span> <strong className="text-slate-900">{parcelData.ownerName}</strong></p>
                    <p><span className="text-slate-500">Canonical Survey Plot:</span> <strong className="text-slate-900">{parcelData.surveyNumber}</strong></p>
                    <p><span className="text-slate-500">Source Record Type:</span> <strong className="text-amber-700">{parcelData.rorType}</strong></p>
                    <p><span className="text-slate-500">Original Unit & Area:</span> <strong className="text-amber-700">{parcelData.areaDisplay}</strong></p>
                    <p><span className="text-slate-500">Normalized Area:</span> <strong className="text-emerald-700 font-mono">3.10 HECTARES (31,000.0 m²)</strong></p>
                    <p><span className="text-slate-500">Land Classification:</span> <strong className="text-slate-900">{parcelData.landType}</strong></p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DYNAMIC PARCEL-SPECIFIC EXPLAINABLE AI RISK TAB */}
          {activeTab === 'ai_risk' && (
            <div className="space-y-6 font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-700" />
                    <span>Explainable AI Risk Governance Assessment</span>
                  </h3>
                  <span className="font-mono text-xs font-black bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-xl">
                    ULPIN: {ulpin}
                  </span>
                </div>
                <p className="text-slate-600 text-xs font-medium">
                  Decision-support risk model evaluation grounded in canonical parcel evidence, spatial geometry, dispute litigation, and tax compliance.
                </p>
              </div>

              {aiLoading ? (
                <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-2">
                  <div className="inline-block animate-spin text-blue-700">⌛</div>
                  <div className="font-extrabold text-slate-900 text-sm">Evaluating Canonical AI Risk Models for {ulpin}...</div>
                  <p className="text-xs text-slate-500">Extracting parcel features across cadastral, revenue court, and tax registers.</p>
                </div>
              ) : aiRiskData ? (
                <div className="space-y-6">
                  
                  {/* Score & Badge Banner */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">Risk Assessment Finding</span>
                      <div className="font-black text-slate-900 text-lg">{aiRiskData.finding || 'Parcel Risk Calculated'}</div>
                      <p className="text-xs text-slate-600 font-medium">{aiRiskData.recommendation}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Confidence Score</span>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          {Math.round((aiRiskData.confidence || 0.95) * 100)}%
                        </span>
                      </div>

                      <div className={`px-5 py-3 rounded-2xl border text-center ${
                        aiRiskData.riskLevel === 'CRITICAL' || aiRiskData.riskLevel === 'HIGH'
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : aiRiskData.riskLevel === 'MEDIUM'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider block">Risk Level</span>
                        <span className="text-xl font-black">{aiRiskData.riskLevel} ({aiRiskData.riskScore}/100)</span>
                      </div>
                    </div>
                  </div>

                  {/* Evidence & Factors Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Key Risk Factors */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-2">
                        Parcel Risk Factors & Impact Scores
                      </div>
                      <div className="space-y-2 text-xs">
                        {aiRiskData.factors && aiRiskData.factors.length > 0 ? (
                          aiRiskData.factors.map((factor: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                              <span className="font-bold text-slate-800">{factor.name}</span>
                              <span className="font-mono font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                +{factor.impact}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 italic text-xs">No adverse risk factors identified.</div>
                        )}
                      </div>
                    </div>

                    {/* Actual Evidence List */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2">
                        Verified Parcel Evidence Signals
                      </div>
                      <div className="space-y-2 text-xs">
                        {aiRiskData.evidence && aiRiskData.evidence.length > 0 ? (
                          aiRiskData.evidence.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium">
                              <span className="text-emerald-700 font-bold">•</span>
                              <span>{item}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 italic text-xs">No evidence records logged.</div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Human-in-the-loop Governance Note */}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>
                        Human-in-the-loop Governance: <strong>{aiRiskData.requiresHumanReview ? 'Required (Officer Inspection Triggered)' : 'Not Required (Verified Clear)'}</strong>
                      </span>
                    </div>
                    <span className="font-mono text-[10px] opacity-80">Model: {aiRiskData.modelName || 'landstack-risk-v1'}</span>
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center text-slate-500 font-semibold text-xs">
                  No AI risk evaluation record available for ULPIN {ulpin}.
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
