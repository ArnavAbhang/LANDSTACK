import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, MapPin, Building2, Layers, FileText, CheckCircle2, AlertTriangle, ArrowRight, X, Map, History } from 'lucide-react';

interface OwnerDossierProps {
  personId: string;
  onClose: () => void;
  onViewParcelOnMap?: (ulpin: string) => void;
  onViewAllParcelsOnMap?: (ulpins: string[]) => void;
}

export const OwnerDossier: React.FC<OwnerDossierProps> = ({ personId, onClose, onViewParcelOnMap, onViewAllParcelsOnMap }) => {
  const [personData, setPersonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROPERTIES' | 'OWNERSHIP' | 'RECORDS' | 'CASES' | 'DOCUMENTS' | 'TIMELINE'>('PROPERTIES');

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/persons/${personId}`, {
      headers: {
        'X-User-Role': 'REVENUE_OFFICER',
        'X-User-Taluka': 'Haveli'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPersonData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [personId]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-600 font-sans text-xs font-semibold">
        Loading Owner Dossier for Person ID {personId}...
      </div>
    );
  }

  if (!personData || personData.error) {
    return (
      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-3 font-sans text-xs">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <h4 className="text-sm font-extrabold text-slate-900">Access Restricted</h4>
        <p className="text-slate-600">{personData?.error || 'Person record not found or outside authorized jurisdiction.'}</p>
        <button onClick={onClose} className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold">Close</button>
      </div>
    );
  }

  const ownerships = personData.ownerships || [];
  const allUlpins = ownerships.map((o: any) => o.ulpin);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-6 font-sans text-xs">
      
      {/* Header Profile Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-black">
                {personData.personId}
              </span>
              <h2 className="text-xl font-black text-slate-900">{personData.name}</h2>
            </div>
            <div className="flex items-center gap-3 text-slate-600 text-[11px] mt-0.5 font-semibold">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-700" /> {personData.districtId} / {personData.talukaId} / {personData.villageId}</span>
              <span>•</span>
              <span className="text-slate-800 font-bold">{personData.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewAllParcelsOnMap && onViewAllParcelsOnMap(allUlpins)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Map className="w-4 h-4" />
            <span>View All Authorized Parcels on GIS</span>
          </button>

          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Dossier Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {['PROPERTIES', 'OWNERSHIP', 'RECORDS', 'CASES', 'DOCUMENTS', 'TIMELINE'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-[11px] transition-all ${
              activeTab === t ? 'bg-blue-900 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1: Properties List */}
      {activeTab === 'PROPERTIES' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-slate-600 font-bold text-[11px] px-1">
            <span>Associated Land Parcels ({ownerships.length})</span>
            <span className="text-blue-900">Identity Layer: Person ID $\rightarrow$ Ownership $\rightarrow$ ULPIN</span>
          </div>

          <div className="space-y-2">
            {ownerships.map((o: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-800 font-medium shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-blue-900 text-sm">{o.ulpin}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      o.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      o.status === 'DISPUTED' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {o.status}
                    </span>
                    <span className="bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-extrabold">
                      {o.ownershipType} ({o.ownershipShare}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-3 font-semibold">
                    <span>Source: {o.sourceSystem}</span>
                    <span>•</span>
                    <span>State: {o.sourceState}</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewParcelOnMap && onViewParcelOnMap(o.ulpin)}
                  className="bg-white hover:bg-slate-100 text-slate-900 px-3.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 self-start md:self-auto border border-slate-300 shadow-sm"
                >
                  <span>View Parcel Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Ownership Relationships */}
      {activeTab === 'OWNERSHIP' && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 font-medium">
          <h4 className="font-black text-slate-900 text-sm">Ownership Graph & Shares</h4>
          <p className="text-slate-600 text-xs">Full legal share distribution across associated ULPIN anchors.</p>
          <div className="space-y-2">
            {ownerships.map((o: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                <div>
                  <span className="font-mono text-blue-900 font-bold">{o.ulpin}</span>
                  <span className="text-slate-600 ml-2">Type: {o.ownershipType}</span>
                </div>
                <div className="font-black text-slate-900">
                  Share: {o.ownershipShare}% ({o.status})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Tab Placeholders */}
      {activeTab !== 'PROPERTIES' && activeTab !== 'OWNERSHIP' && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center text-slate-600 space-y-2">
          <FileText className="w-6 h-6 text-blue-700 mx-auto" />
          <p className="font-black text-slate-900">Authorized {activeTab} Records</p>
          <p className="text-slate-600 font-medium">Official state records linked under Person ID {personData.personId} in officer jurisdiction.</p>
        </div>
      )}

    </div>
  );
};
