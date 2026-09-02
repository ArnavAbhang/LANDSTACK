import React from 'react';
import { Layers, ShieldCheck, MapPin, Cpu, UserCheck, FileText, Activity } from 'lucide-react';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 tracking-tight">LAND STACK</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                  Official DPI Platform
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold hidden sm:block">
                Integrated Digital Land Governance
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('gis')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'gis'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>GIS Map Portal</span>
            </button>

            <button
              onClick={() => onTabChange('adapter')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'adapter'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>State Adapter Hub</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{currentRole === 'LAND_OWNER' ? 'Citizen Dashboard' : 'Govt Department Portal'}</span>
            </button>
          </nav>

          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
              <UserCheck className="w-4 h-4 text-blue-900" />
              <span className="text-slate-500 hidden lg:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="LAND_OWNER" className="bg-white text-slate-900">Land Owner / Citizen</option>
                <option value="REVENUE_OFFICER" className="bg-white text-slate-900">Revenue Officer (MH/TN)</option>
                <option value="REGISTRATION_OFFICER" className="bg-white text-slate-900">Registration Registrar</option>
                <option value="TAX_OFFICER" className="bg-white text-slate-900">Property Tax Dept</option>
                <option value="ADMIN" className="bg-white text-slate-900">System Admin (DoLR Hub)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-extrabold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ULPIN DPI Active</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
