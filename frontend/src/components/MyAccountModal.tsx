import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, ShieldCheck, Clock, Edit3, Save, CheckCircle2, FileText } from 'lucide-react';
import {
  STATES_DATA,
  getCitiesForState,
  getTalukasForDistrict,
  getVillagesForTaluka,
  LocationOption,
} from '../utils/locationData';

interface MyAccountModalProps {
  user: any;
  location: any;
  onClose: () => void;
  onUpdateUser: (updatedUser: any, updatedLocation: any) => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({
  user,
  location,
  onClose,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || 'Rajendra Patil');
  const [email] = useState(user?.email || 'resident@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98230 11245');
  const aadhaarNumber = user?.aadhaarNumber || '9876-5432-1098';
  const verificationStatus = user?.verificationStatus || 'APPROVED';

  // Location fields for Edit Profile
  const [selectedState, setSelectedState] = useState(user?.stateId || location?.stateId || 'ST_MH');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.districtId || location?.districtId || 'DIST_PUNE');
  const [selectedTaluka, setSelectedTaluka] = useState(user?.talukaId || location?.talukaId || 'TAL_HAVELI');
  const [selectedVillage, setSelectedVillage] = useState(user?.villageId || location?.villageId || 'LOC_PAUD');

  // Dynamic Options
  const [districtsOptions, setDistrictsOptions] = useState<LocationOption[]>([]);
  const [talukasOptions, setTalukasOptions] = useState<LocationOption[]>([]);
  const [villagesOptions, setVillagesOptions] = useState<LocationOption[]>([]);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Dynamic State -> City (District) filtering
  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/states/${selectedState}/districts`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((d) => ({ id: d.id, name: d.name, code: d.code }));
        setDistrictsOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((d) => d.id === selectedDistrict);
          setSelectedDistrict(match ? match.id : formatted[0].id);
        }
      })
      .catch(() => {
        const cities = getCitiesForState(selectedState);
        setDistrictsOptions(cities);
        if (cities.length > 0) {
          const match = cities.find((d) => d.id === selectedDistrict);
          setSelectedDistrict(match ? match.id : cities[0].id);
        }
      });
  }, [selectedState]);

  // 2. Dynamic District -> Taluka filtering
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`http://localhost:8080/api/locations/districts/${selectedDistrict}/talukas`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((t) => ({ id: t.id, name: t.name }));
        setTalukasOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((t) => t.id === selectedTaluka);
          setSelectedTaluka(match ? match.id : formatted[0].id);
        }
      })
      .catch(() => {
        const tals = getTalukasForDistrict(selectedDistrict);
        setTalukasOptions(tals);
        if (tals.length > 0) {
          const match = tals.find((t) => t.id === selectedTaluka);
          setSelectedTaluka(match ? match.id : tals[0].id);
        }
      });
  }, [selectedDistrict]);

  // 3. Dynamic Taluka -> Village filtering
  useEffect(() => {
    if (!selectedTaluka) return;
    fetch(`http://localhost:8080/api/locations/talukas/${selectedTaluka}/villages`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((v) => ({ id: v.id, name: v.villageName || v.name }));
        setVillagesOptions(formatted);
        if (formatted.length > 0) {
          const match = formatted.find((v) => v.id === selectedVillage);
          setSelectedVillage(match ? match.id : formatted[0].id);
        }
      })
      .catch(() => {
        const vils = getVillagesForTaluka(selectedTaluka);
        setVillagesOptions(vils);
        if (vils.length > 0) {
          const match = vils.find((v) => v.id === selectedVillage);
          setSelectedVillage(match ? match.id : vils[0].id);
        }
      });
  }, [selectedTaluka]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const stateObj = STATES_DATA.find((s) => s.id === selectedState);
    const distObj = districtsOptions.find((d) => d.id === selectedDistrict);
    const talObj = talukasOptions.find((t) => t.id === selectedTaluka);
    const vilObj = villagesOptions.find((v) => v.id === selectedVillage);

    const payload = {
      email,
      name,
      phone,
      state: stateObj?.name || 'Maharashtra',
      stateId: selectedState,
      district: distObj?.name || 'Pune',
      districtId: selectedDistrict,
      taluka: talObj?.name || 'Haveli',
      talukaId: selectedTaluka,
      village: vilObj?.name || 'Paud',
      villageId: selectedVillage,
    };

    fetch('http://localhost:8080/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        onUpdateUser(
          { ...user, name, phone, state: payload.state, district: payload.district },
          {
            stateId: selectedState,
            stateName: payload.state,
            districtId: selectedDistrict,
            districtName: payload.district,
            talukaId: selectedTaluka,
            talukaName: payload.taluka,
            villageId: selectedVillage,
            villageName: payload.village,
          }
        );
      })
      .catch(() => {
        setSaving(false);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        onUpdateUser(
          { ...user, name, phone, state: payload.state, district: payload.district },
          {
            stateId: selectedState,
            stateName: payload.state,
            districtId: selectedDistrict,
            districtName: payload.district,
            talukaId: selectedTaluka,
            talukaName: payload.taluka,
            villageId: selectedVillage,
            villageName: payload.village,
          }
        );
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Resident Profile & Account</h2>
              <p className="text-xs text-blue-200">Aadhaar Keyed Digital Public Infrastructure Account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-blue-900 text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Verification Status Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            verificationStatus === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : verificationStatus === 'PENDING_ADMIN_APPROVAL'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              {verificationStatus === 'APPROVED' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              ) : (
                <Clock className="w-6 h-6 text-amber-700" />
              )}
              <div>
                <div className="font-extrabold text-sm flex items-center gap-2">
                  <span>Aadhaar Identity Status:</span>
                  <span className="uppercase text-[11px] font-black underline">
                    {verificationStatus === 'APPROVED' ? 'Verified Access Granted' : 'Pending System Admin Approval'}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {verificationStatus === 'APPROVED'
                    ? 'Verified by System Administrator — Full Platform Access Active'
                    : 'Aadhaar Card request submitted to System Administrator for review'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-black bg-white/80 px-2.5 py-1 rounded-lg border">
              Aadhaar: XXXX-XXXX-{aadhaarNumber.slice(-4)}
            </span>
          </div>

          {!isEditing ? (
            /* VIEW PROFILE MODE */
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Full Name:</span>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {name}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Email Address:</span>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {email}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Phone Number:</span>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {phone}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">Aadhaar Key:</span>
                  <span className="font-extrabold text-slate-900 text-sm font-mono flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {aadhaarNumber}
                  </span>
                </div>
              </div>

              {/* Saved Administrative Jurisdiction */}
              <div className="border border-slate-200 p-5 rounded-2xl space-y-3 bg-white">
                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider text-blue-900">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>Registered Governance Jurisdiction</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-semibold">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">State:</span>
                    <span className="font-extrabold text-slate-900">{location?.stateName || user?.state || 'Maharashtra'}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">City / District:</span>
                    <span className="font-extrabold text-slate-900">{location?.districtName || user?.district || 'Pune'}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Taluka / Tehsil:</span>
                    <span className="font-extrabold text-slate-900">{location?.talukaName || user?.taluka || 'Haveli'}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Village / Locality:</span>
                    <span className="font-extrabold text-emerald-800">{location?.villageName || user?.village || 'Paud'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile & Location Jurisdiction</span>
              </button>

            </div>
          ) : (
            /* EDIT PROFILE MODE (Supports dynamic State -> City cascading) */
            <form onSubmit={handleSaveProfile} className="space-y-4 font-semibold">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-black text-slate-900 text-sm">Edit Profile Information</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                  required
                />
              </div>

              {/* Dynamic State Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                >
                  {STATES_DATA.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Dynamic City / District Selection (State Filtered) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    City / District <span className="text-blue-900 font-extrabold">(Filtered)</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                  >
                    {districtsOptions.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Taluka / Tehsil</label>
                  <select
                    value={selectedTaluka}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                  >
                    {talukasOptions.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Village / Locality</label>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2 rounded-xl focus:border-blue-700 focus:outline-none font-bold"
                >
                  {villagesOptions.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Updated Profile'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
