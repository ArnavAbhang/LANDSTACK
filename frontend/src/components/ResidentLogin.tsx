import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Mail, UserCheck, ShieldCheck, UserPlus, MapPin } from 'lucide-react';
import {
  STATES_DATA,
  getCitiesForState,
  getTalukasForDistrict,
  getVillagesForTaluka,
  LocationOption,
} from '../utils/locationData';

interface ResidentLoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onNavigateRegister?: () => void;
  onBackToLanding: () => void;
}

export const ResidentLogin: React.FC<ResidentLoginProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form state
  const [email, setEmail] = useState('resident@example.com');
  const [password, setPassword] = useState('password123');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regState, setRegState] = useState('ST_MH');
  const [regDistrict, setRegDistrict] = useState('DIST_PUNE');
  const [regTaluka, setRegTaluka] = useState('TAL_HAVELI');
  const [regVillage, setRegVillage] = useState('LOC_PAUD');

  // Dynamic dropdown options for registration
  const [districtsOptions, setDistrictsOptions] = useState<LocationOption[]>([]);
  const [talukasOptions, setTalukasOptions] = useState<LocationOption[]>([]);
  const [villagesOptions, setVillagesOptions] = useState<LocationOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Dynamic State -> City (District) filtering
  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/states/${regState}/districts`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((d) => ({ id: d.id, name: d.name, code: d.code }));
        setDistrictsOptions(formatted);
        if (formatted.length > 0) setRegDistrict(formatted[0].id);
      })
      .catch(() => {
        const cities = getCitiesForState(regState);
        setDistrictsOptions(cities);
        if (cities.length > 0) setRegDistrict(cities[0].id);
      });
  }, [regState]);

  // 2. Dynamic District -> Taluka filtering
  useEffect(() => {
    if (!regDistrict) return;
    fetch(`http://localhost:8080/api/locations/districts/${regDistrict}/talukas`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((t) => ({ id: t.id, name: t.name }));
        setTalukasOptions(formatted);
        if (formatted.length > 0) setRegTaluka(formatted[0].id);
      })
      .catch(() => {
        const tals = getTalukasForDistrict(regDistrict);
        setTalukasOptions(tals);
        if (tals.length > 0) setRegTaluka(tals[0].id);
      });
  }, [regDistrict]);

  // 3. Dynamic Taluka -> Village filtering
  useEffect(() => {
    if (!regTaluka) return;
    fetch(`http://localhost:8080/api/locations/talukas/${regTaluka}/villages`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const formatted = data.map((v) => ({ id: v.id, name: v.villageName || v.name }));
        setVillagesOptions(formatted);
        if (formatted.length > 0) setRegVillage(formatted[0].id);
      })
      .catch(() => {
        const vils = getVillagesForTaluka(regTaluka);
        setVillagesOptions(vils);
        if (vils.length > 0) setRegVillage(vils[0].id);
      });
  }, [regTaluka]);

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, portal: 'RESIDENT' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.token) {
          onLoginSuccess(data.token, data.user);
        } else {
          setError(data.error || 'Authentication failed');
        }
      })
      .catch(() => {
        setLoading(false);
        // Fallback demo user with pre-configured state & city
        onLoginSuccess('token_res_demo', {
          id: 'usr_res_01',
          email: email,
          name: 'Rajendra Patil',
          role: 'RESIDENT',
          portal: 'RESIDENT',
          state: 'Maharashtra',
          stateId: 'ST_MH',
          district: 'Pune',
          districtId: 'DIST_PUNE',
          taluka: 'Haveli',
          talukaId: 'TAL_HAVELI',
          village: 'Paud',
          villageId: 'LOC_PAUD',
        });
      });
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const stateObj = STATES_DATA.find((s) => s.id === regState);
    const distObj = districtsOptions.find((d) => d.id === regDistrict);
    const talObj = talukasOptions.find((t) => t.id === regTaluka);
    const vilObj = villagesOptions.find((v) => v.id === regVillage);

    const payload = {
      name: regName || 'Resident Citizen',
      email: regEmail,
      password: regPassword,
      portal: 'RESIDENT',
      state: stateObj?.name || 'Maharashtra',
      stateId: regState,
      district: distObj?.name || 'Pune',
      districtId: regDistrict,
      taluka: talObj?.name || 'Haveli',
      talukaId: regTaluka,
      village: vilObj?.name || 'Paud',
      villageId: regVillage,
    };

    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.token) {
          onLoginSuccess(data.token, { ...data.user, isNewUser: true });
        } else {
          setError(data.error || 'Account creation failed');
        }
      })
      .catch(() => {
        setLoading(false);
        // Fallback creation
        onLoginSuccess('token_reg_new', {
          id: 'usr_reg_' + Date.now(),
          email: regEmail,
          name: regName || 'Resident Citizen',
          role: 'RESIDENT',
          portal: 'RESIDENT',
          isNewUser: true,
          state: stateObj?.name || 'Maharashtra',
          stateId: regState,
          district: distObj?.name || 'Pune',
          districtId: regDistrict,
          taluka: talObj?.name || 'Haveli',
          talukaId: regTaluka,
          village: vilObj?.name || 'Paud',
          villageId: regVillage,
        });
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-center items-center p-6 relative font-sans">
      
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-slate-700 hover:text-slate-900 text-xs flex items-center gap-2 font-bold bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Public Gateway</span>
      </button>

      <div className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            {isRegistering ? <UserPlus className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isRegistering ? 'Create Resident Account' : 'Resident Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {isRegistering
              ? 'Register once with your State & City to access saved land records'
              : 'Access digital land records, Patta extracts, and mutation services'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isRegistering ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isRegistering ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">{error}</div>}

        {!isRegistering ? (
          /* SIGN IN FORM (No state/city prompt needed — uses saved user profile) */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600 text-xs space-y-1">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Sample Access Profile</span>
              </div>
              <p className="text-[11px]">Email: <code className="text-slate-900 font-mono font-bold">resident@example.com</code> | Password: <code className="text-slate-900 font-mono font-bold">password123</code></p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-4 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-4 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold p-3 rounded-xl transition-all shadow-md text-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In to Resident Gateway'}
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM (Captures State & City dynamically once during registration) */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rajendra Patil"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-semibold"
                  required
                />
              </div>
            </div>

            {/* Dynamic State Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Select State</span>
              </label>
              <select
                value={regState}
                onChange={(e) => setRegState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-bold"
              >
                {STATES_DATA.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            {/* Dynamic City / District Selection (Filters based on selected state) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  City / District <span className="text-emerald-700 font-extrabold">(State Filtered)</span>
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-bold"
                >
                  {districtsOptions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Taluka / Tehsil</label>
                <select
                  value={regTaluka}
                  onChange={(e) => setRegTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-bold"
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
                value={regVillage}
                onChange={(e) => setRegVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:border-emerald-600 focus:outline-none font-bold"
              >
                {villagesOptions.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold p-3 rounded-xl transition-all shadow-md text-xs"
            >
              {loading ? 'Creating Profile...' : 'Create Account & Start Exploring'}
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
