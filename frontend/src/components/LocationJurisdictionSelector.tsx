import React, { useState, useEffect } from 'react';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import {
  STATES_DATA,
  getCitiesForState,
  getTalukasForDistrict,
  getVillagesForTaluka,
  getSubDivisionTerm,
  LocationOption,
} from '../utils/locationData';

interface LocationJurisdictionSelectorProps {
  portal: 'RESIDENT' | 'GOVERNMENT';
  user: any;
  onProceed: (selectedJurisdiction: any) => void;
}

export const LocationJurisdictionSelector: React.FC<LocationJurisdictionSelectorProps> = ({
  portal,
  user,
  onProceed,
}) => {
  const [selectedState, setSelectedState] = useState(user?.stateId || 'ST_MH');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.districtId || 'DIST_PUNE');
  const [selectedTaluka, setSelectedTaluka] = useState(user?.talukaId || 'TAL_HAVELI');
  const [selectedVillage, setSelectedVillage] = useState(user?.villageId || 'LOC_PAUD');
  const [selectedDepartment, setSelectedDepartment] = useState(user?.department || 'REVENUE');
  const [selectedRole, setSelectedRole] = useState(user?.role || 'REVENUE_OFFICER');

  const [districtsOptions, setDistrictsOptions] = useState<LocationOption[]>([]);
  const [talukasOptions, setTalukasOptions] = useState<LocationOption[]>([]);
  const [villagesOptions, setVillagesOptions] = useState<LocationOption[]>([]);

  const subDivisionLabel = getSubDivisionTerm(selectedState);

  // 1. State change effect -> Fetch districts for selected State
  useEffect(() => {
    if (!selectedState) {
      setDistrictsOptions([]);
      setSelectedDistrict('');
      return;
    }

    fetch(`http://localhost:8080/api/locations/states/${selectedState}/districts`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((d) => ({ id: d.id, name: d.name, code: d.code, stateId: selectedState }));
        setDistrictsOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((d) => d.id === selectedDistrict);
          setSelectedDistrict(match ? match.id : formatted[0].id);
        } else {
          setSelectedDistrict('');
        }
      })
      .catch(() => {
        const cities = getCitiesForState(selectedState);
        setDistrictsOptions(cities);
        if (cities.length > 0) {
          const match = cities.find((d) => d.id === selectedDistrict);
          setSelectedDistrict(match ? match.id : cities[0].id);
        } else {
          setSelectedDistrict('');
        }
      });
  }, [selectedState]);

  // 2. District change effect -> Fetch talukas for selected District
  useEffect(() => {
    if (!selectedDistrict) {
      setTalukasOptions([]);
      setSelectedTaluka('');
      return;
    }

    fetch(`http://localhost:8080/api/locations/districts/${selectedDistrict}/talukas`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((t) => ({ id: t.id, name: t.name, districtId: selectedDistrict }));
        setTalukasOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((t) => t.id === selectedTaluka);
          setSelectedTaluka(match ? match.id : formatted[0].id);
        } else {
          setSelectedTaluka('');
        }
      })
      .catch(() => {
        const tals = getTalukasForDistrict(selectedDistrict);
        setTalukasOptions(tals);
        if (tals.length > 0) {
          const match = tals.find((t) => t.id === selectedTaluka);
          setSelectedTaluka(match ? match.id : tals[0].id);
        } else {
          setSelectedTaluka('');
        }
      });
  }, [selectedDistrict]);

  // 3. Taluka change effect -> Fetch villages for selected Taluka
  useEffect(() => {
    if (!selectedTaluka) {
      setVillagesOptions([]);
      setSelectedVillage('');
      return;
    }

    fetch(`http://localhost:8080/api/locations/talukas/${selectedTaluka}/villages`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((v) => ({ id: v.id, name: v.villageName || v.name, talukaId: selectedTaluka }));
        setVillagesOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((v) => v.id === selectedVillage);
          setSelectedVillage(match ? match.id : formatted[0].id);
        } else {
          setSelectedVillage('');
        }
      })
      .catch(() => {
        const vils = getVillagesForTaluka(selectedTaluka);
        setVillagesOptions(vils);
        if (vils.length > 0) {
          const match = vils.find((v) => v.id === selectedVillage);
          setSelectedVillage(match ? match.id : vils[0].id);
        } else {
          setSelectedVillage('');
        }
      });
  }, [selectedTaluka]);

  // Handlers for Parent Dropdown Changes
  const handleStateChange = (newSt: string) => {
    setSelectedState(newSt);
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
  };

  const handleDistrictChange = (newDist: string) => {
    setSelectedDistrict(newDist);
    setSelectedTaluka('');
    setSelectedVillage('');
  };

  const handleTalukaChange = (newTal: string) => {
    setSelectedTaluka(newTal);
    setSelectedVillage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stateObj = STATES_DATA.find((s) => s.id === selectedState);
    const distObj = districtsOptions.find((d) => d.id === selectedDistrict);
    const talObj = talukasOptions.find((t) => t.id === selectedTaluka);
    const vilObj = villagesOptions.find((v) => v.id === selectedVillage);

    onProceed({
      stateId: selectedState,
      stateName: stateObj?.name || 'Maharashtra',
      districtId: selectedDistrict,
      districtName: distObj?.name || 'Pune',
      talukaId: selectedTaluka,
      talukaName: talObj?.name || 'Haveli',
      villageId: selectedVillage,
      villageName: vilObj?.name || 'Paud',
      departmentCode: selectedDepartment,
      roleCode: selectedRole,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
            {portal === 'GOVERNMENT' ? <Building2 className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {portal === 'GOVERNMENT' ? 'Select Governance Jurisdiction' : 'Select Locality & Area'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {portal === 'GOVERNMENT'
              ? 'Configure department scope and administrative jurisdiction'
              : 'Choose state and village locality to view authorized land records'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          
          {/* State Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
            >
              {STATES_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* District Selector (Disabled if no State) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">City / District</label>
            <select
              value={selectedDistrict}
              disabled={!selectedState || districtsOptions.length === 0}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-blue-700 focus:outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {districtsOptions.length === 0 && <option value="">Select District</option>}
              {districtsOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Division (Taluka / Tehsil / Taluk) Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">{subDivisionLabel}</label>
            <select
              value={selectedTaluka}
              disabled={!selectedDistrict || talukasOptions.length === 0}
              onChange={(e) => handleTalukaChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-blue-700 focus:outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {talukasOptions.length === 0 && <option value="">Select {subDivisionLabel}</option>}
              {talukasOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Village / Locality</label>
            <select
              value={selectedVillage}
              disabled={!selectedTaluka || villagesOptions.length === 0}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-blue-700 focus:outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {villagesOptions.length === 0 && <option value="">Select Village</option>}
              {villagesOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {portal === 'GOVERNMENT' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                >
                  <option value="REVENUE">Revenue Department</option>
                  <option value="SURVEY">Survey & Land Records</option>
                  <option value="REGISTRATION">Registration & Stamp Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                >
                  <option value="REVENUE_OFFICER">Revenue Officer (Tahsildar)</option>
                  <option value="SURVEYOR">Land Surveyor</option>
                  <option value="SUB_REGISTRAR">Sub-Registrar</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs pt-3"
          >
            <span>Proceed to Authorized Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
