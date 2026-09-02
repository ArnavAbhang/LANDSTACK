import React, { useState, useEffect } from 'react';
import { Filter, CheckCircle2, Search } from 'lucide-react';
import {
  STATES_DATA,
  getCitiesForState,
  getTalukasForDistrict,
  getVillagesForTaluka,
  getSubDivisionTerm,
} from '../utils/locationData';

interface LocalitySelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  selectedTaluka: string;
  onTalukaChange: (taluka: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
  onSearchUlpin?: (ulpin: string) => void;
}

export const LocalitySelector: React.FC<LocalitySelectorProps> = ({
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  selectedTaluka,
  onTalukaChange,
  selectedVillage,
  onVillageChange,
  onSearchUlpin,
}) => {
  const [states, setStates] = useState<any[]>(STATES_DATA);
  const [districts, setDistricts] = useState<any[]>([]);
  const [talukas, setTalukas] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  const subDivisionLabel = getSubDivisionTerm(selectedState);

  // 1. Fetch States
  useEffect(() => {
    fetch('http://localhost:8080/api/locations/states')
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch(() => setStates(STATES_DATA));
  }, []);

  // 2. Fetch Districts when State changes (Dynamically filters cities for selected state only)
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }
    fetch(`http://localhost:8080/api/locations/states/${selectedState}/districts`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data);
        if (data.length > 0) {
          const match = data.find((d: any) => d.id === selectedDistrict);
          onDistrictChange(match ? match.id : data[0].id);
        }
      })
      .catch(() => {
        const fallback = getCitiesForState(selectedState);
        setDistricts(fallback);
        if (fallback.length > 0) {
          const match = fallback.find((d: any) => d.id === selectedDistrict);
          onDistrictChange(match ? match.id : fallback[0].id);
        }
      });
  }, [selectedState]);

  // 3. Fetch Talukas when District changes
  useEffect(() => {
    if (!selectedDistrict) {
      setTalukas([]);
      return;
    }
    fetch(`http://localhost:8080/api/locations/districts/${selectedDistrict}/talukas`)
      .then((res) => res.json())
      .then((data) => {
        setTalukas(data);
        if (data.length > 0) {
          const match = data.find((t: any) => t.id === selectedTaluka);
          onTalukaChange(match ? match.id : data[0].id);
        }
      })
      .catch(() => {
        const fallback = getTalukasForDistrict(selectedDistrict);
        setTalukas(fallback);
        if (fallback.length > 0) {
          const match = fallback.find((t: any) => t.id === selectedTaluka);
          onTalukaChange(match ? match.id : fallback[0].id);
        }
      });
  }, [selectedDistrict]);

  // 4. Fetch Villages when Taluka changes
  useEffect(() => {
    if (!selectedTaluka) {
      setVillages([]);
      return;
    }
    fetch(`http://localhost:8080/api/locations/talukas/${selectedTaluka}/villages`)
      .then((res) => res.json())
      .then((data) => {
        setVillages(data);
        if (data.length > 0) {
          const match = data.find((v: any) => v.id === selectedVillage);
          onVillageChange(match ? match.id : data[0].id);
        }
      })
      .catch(() => {
        const fallback = getVillagesForTaluka(selectedTaluka);
        setVillages(fallback);
        if (fallback.length > 0) {
          const match = fallback.find((v: any) => v.id === selectedVillage);
          onVillageChange(match ? match.id : fallback[0].id);
        }
      });
  }, [selectedTaluka]);

  const handleStateChange = (newSt: string) => {
    onStateChange(newSt);
    onDistrictChange('');
    onTalukaChange('');
    onVillageChange('');
  };

  const handleDistrictChange = (newDist: string) => {
    onDistrictChange(newDist);
    onTalukaChange('');
    onVillageChange('');
  };

  const handleTalukaChange = (newTal: string) => {
    onTalukaChange(newTal);
    onVillageChange('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchUlpin) {
      onSearchUlpin(searchQuery.trim());
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 sticky top-16 z-30 shadow-sm text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Locality Cascading Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-900" />
            <span>Locality Hierarchy:</span>
          </div>

          {/* State Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent font-extrabold text-blue-900 focus:outline-none cursor-pointer"
            >
              {states.map((st) => (
                <option key={st.id} value={st.id} className="bg-white text-slate-900">
                  {st.name} ({st.code || st.id})
                </option>
              ))}
            </select>
          </div>

          {/* District Selector (Dynamic for State) */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">District / City:</span>
            <select
              value={selectedDistrict}
              disabled={!selectedState || districts.length === 0}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              {districts.length === 0 && <option value="">Select District</option>}
              {districts.map((d) => (
                <option key={d.id} value={d.id} className="bg-white text-slate-900">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Division (Taluka / Tehsil / Taluk) Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">{subDivisionLabel}:</span>
            <select
              value={selectedTaluka}
              disabled={!selectedDistrict || talukas.length === 0}
              onChange={(e) => handleTalukaChange(e.target.value)}
              className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              {talukas.length === 0 && <option value="">Select {subDivisionLabel}</option>}
              {talukas.map((t) => (
                <option key={t.id} value={t.id} className="bg-white text-slate-900">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">Village:</span>
            <select
              value={selectedVillage}
              disabled={!selectedTaluka || villages.length === 0}
              onChange={(e) => onVillageChange(e.target.value)}
              className="bg-transparent font-extrabold text-emerald-800 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              {villages.length === 0 && <option value="">Select Village</option>}
              {villages.map((v) => (
                <option key={v.id} value={v.id} className="bg-white text-slate-900">
                  {v.villageName || v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Locality Bounds Sync</span>
          </div>
        </div>

        {/* Quick ULPIN Search Form */}
        {onSearchUlpin && (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search ULPIN parcel key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold pl-8 pr-3 py-1.5 rounded-lg focus:border-blue-900 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
