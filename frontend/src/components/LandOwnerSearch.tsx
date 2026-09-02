import React, { useState, useEffect } from 'react';
import { Search, UserCheck, ShieldCheck, MapPin, Building2, Layers, Filter, AlertTriangle, ArrowRight, UserX, CheckCircle2 } from 'lucide-react';
import { OwnerDossier } from './OwnerDossier';

interface LandOwnerSearchProps {
  onViewParcelOnMap?: (ulpin: string) => void;
  onViewAllParcelsOnMap?: (ulpins: string[]) => void;
}

export const LandOwnerSearch: React.FC<LandOwnerSearchProps> = ({ onViewParcelOnMap, onViewAllParcelsOnMap }) => {
  const [searchMode, setSearchMode] = useState<string>('NAME'); // NAME, PERSON_ID, ULPIN, SURVEY, PARCEL_ID, CASE_ID, SERVICE_REQ
  const [query, setQuery] = useState<string>('Rahul Anil Deshmukh');
  const [stateFilter, setStateFilter] = useState<string>('MH');
  const [districtFilter, setDistrictFilter] = useState<string>('Pune');
  const [talukaFilter, setTalukaFilter] = useState<string>('Haveli');
  const [results, setResults] = useState<any[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searching, setSearching] = useState<boolean>(false);

  const executeSearch = () => {
    setSearching(true);
    let url = 'http://localhost:8080/api/v1/persons/search?';

    if (searchMode === 'PERSON_ID') url += `personId=${encodeURIComponent(query)}`;
    else if (searchMode === 'ULPIN') url += `ulpin=${encodeURIComponent(query)}`;
    else url += `name=${encodeURIComponent(query)}`;

    fetch(url, {
      headers: {
        'X-User-Role': 'REVENUE_OFFICER',
        'X-User-Taluka': talukaFilter
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setSearching(false);
      })
      .catch(() => setSearching(false));
  };

  useEffect(() => {
    executeSearch();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Landowner Identity & Governance Portal</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Government Land & Owner Search</h2>
          <p className="text-xs text-slate-600 font-medium">Search landowner identity profiles, resolve duplicate names via Person ID, and aggregate authorized parcels under officer jurisdiction.</p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono text-blue-900 font-extrabold">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>JBAC Jurisdiction Active: {talukaFilter} Taluka</span>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
          
          {/* Search Mode Select */}
          <div className="space-y-1">
            <label className="text-slate-600 font-bold text-[10px] uppercase">Search By</label>
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl font-bold focus:border-blue-700 focus:outline-none"
            >
              <option value="NAME">Owner Name</option>
              <option value="PERSON_ID">Person ID (LS-PER-XXXXXX)</option>
              <option value="ULPIN">ULPIN (Land Parcel ID)</option>
              <option value="SURVEY">Survey Number</option>
              <option value="PARCEL_ID">State Parcel ID</option>
              <option value="CASE_ID">Case ID</option>
              <option value="SERVICE_REQ">Service Request ID</option>
            </select>
          </div>

          {/* Search Query Input */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-slate-600 font-bold text-[10px] uppercase">Search Query</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter owner name, Person ID, or ULPIN..."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 pl-9 rounded-xl font-bold focus:border-blue-700 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Search Action Button */}
          <div className="flex items-end">
            <button
              onClick={executeSearch}
              disabled={searching}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white p-2.5 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search Landowners</span>
            </button>
          </div>
        </div>

        {/* Jurisdiction Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
          <span className="text-slate-500 font-bold text-[10px] flex items-center gap-1"><Filter className="w-3 h-3" /> JURISDICTION SCOPE:</span>
          
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold">
            <option value="MH">Maharashtra</option>
            <option value="TN">Tamil Nadu</option>
            <option value="PB">Punjab</option>
          </select>

          <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold">
            <option value="Pune">Pune</option>
            <option value="Kanchipuram">Kanchipuram</option>
            <option value="SAS Nagar">SAS Nagar</option>
          </select>

          <select value={talukaFilter} onChange={(e) => setTalukaFilter(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold">
            <option value="Haveli">Haveli</option>
            <option value="Mulshi">Mulshi</option>
            <option value="Chengalpattu">Chengalpattu</option>
            <option value="ALL">ALL (Admin View)</option>
          </select>
        </div>
      </div>

      {/* Selected Owner Dossier View */}
      {selectedPersonId && (
        <OwnerDossier
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
          onViewParcelOnMap={onViewParcelOnMap}
          onViewAllParcelsOnMap={onViewAllParcelsOnMap}
        />
      )}

      {/* Search Results Grid */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-700" />
            <span>Matching Landowner Identity Records ({results.length})</span>
          </h3>
          <span className="text-xs text-slate-600 font-semibold">Duplicate Name Disambiguation Engine Active</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl text-center space-y-2 text-slate-600 text-xs">
            <UserX className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-900">No Matching Landowners Found</p>
            <p>Try searching by different name spellings or Person ID in your officer jurisdiction scope.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            {results.map((p: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded text-[10px] font-mono font-black">
                      {p.personId}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{p.name}</h4>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-[10px] font-extrabold">
                    {p.authorizedParcelCount || 1} Authorized Parcels
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 font-semibold">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-700" /> {p.districtId} / {p.talukaId} / {p.villageId}</div>
                  <div>Contact: {p.phone}</div>
                </div>

                <button
                  onClick={() => setSelectedPersonId(p.personId)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white p-2.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>View Owner Dossier</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
