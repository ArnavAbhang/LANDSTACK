import React, { useState, useEffect } from 'react';
import { PublicLandingGateway } from './components/PublicLandingGateway';
import { ResidentLogin } from './components/ResidentLogin';
import { GovernmentLogin } from './components/GovernmentLogin';
import { LocationJurisdictionSelector } from './components/LocationJurisdictionSelector';
import { ResidentDashboard } from './components/ResidentDashboard';
import { GisMapViewer } from './components/GisMapViewer';
import { LocalitySelector } from './components/LocalitySelector';
import { ParcelDetailModal } from './components/ParcelDetailModal';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { AiGovernanceDashboard } from './components/AiGovernanceDashboard';
import { LandAssistant } from './components/LandAssistant';
import { MapPin, Layers, User, ShieldCheck, Search, Building2, Cpu, Sparkles, Bot, LogOut, ArrowLeft, Globe } from 'lucide-react';
import { saveSession, getSavedSession, clearSession, updateSessionRoute, updateSessionJurisdiction } from './utils/session';

export default function App() {
  // Synchronous session restoration on initial load
  const restoredSession = getSavedSession();

  // Navigation Route State
  const [currentRoute, setCurrentRoute] = useState<
    'LANDING' | 'RESIDENT_LOGIN' | 'RESIDENT_JURISDICTION' | 'RESIDENT_APP' | 'RESIDENT_MAP' | 'GOVERNMENT_LOGIN' | 'GOVERNMENT_JURISDICTION' | 'GOVERNMENT_APP'
  >(restoredSession?.route as any || 'LANDING');

  // Authenticated State
  const [authToken, setAuthToken] = useState<string | null>(restoredSession?.token || null);
  const [authUser, setAuthUser] = useState<any>(restoredSession?.user || null);
  
  const [jurisdiction, setJurisdiction] = useState<any>(
    restoredSession?.jurisdiction || {
      stateId: 'ST_MH',
      stateName: 'Maharashtra',
      districtId: 'DIST_PUNE',
      districtName: 'Pune',
      talukaId: 'TAL_HAVELI',
      talukaName: 'Haveli',
      villageId: 'LOC_PAUD',
      villageName: 'Paud',
      departmentCode: 'REVENUE',
      roleCode: 'REVENUE_OFFICER',
    }
  );

  // Inner Tab State
  const [activeTab, setActiveTab] = useState<'map' | 'government' | 'ai_governance'>('government');
  const [selectedUlpin, setSelectedUlpin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState(authUser?.role || 'REVENUE_OFFICER');
  const [showAssistant, setShowAssistant] = useState(false);

  // Sync state to local session store
  useEffect(() => {
    if (authToken && authUser) {
      saveSession(authToken, authUser, currentRoute, jurisdiction);
    }
  }, [authToken, authUser, currentRoute, jurisdiction]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedUlpin(searchQuery.trim());
    }
  };

  const handleLogout = () => {
    clearSession();
    setAuthToken(null);
    setAuthUser(null);
    setCurrentRoute('LANDING');
  };

  const navigateTo = (route: any) => {
    setCurrentRoute(route);
    updateSessionRoute(route);
  };

  const updateJurisdictionState = (newJur: any) => {
    setJurisdiction(newJur);
    updateSessionJurisdiction(newJur);
  };

  // STAGE 1: Public Landing Gateway Page (Unauthenticated Users)
  if (currentRoute === 'LANDING') {
    return (
      <PublicLandingGateway
        onSelectPortal={(portal) => {
          if (portal === 'RESIDENT') navigateTo('RESIDENT_LOGIN');
          else navigateTo('GOVERNMENT_LOGIN');
        }}
      />
    );
  }

  // STAGE 2: Resident Portal Login & Registration
  if (currentRoute === 'RESIDENT_LOGIN') {
    return (
      <ResidentLogin
        onLoginSuccess={(token, user) => {
          const jur = {
            stateId: user?.stateId || 'ST_MH',
            stateName: user?.state || 'Maharashtra',
            districtId: user?.districtId || 'DIST_PUNE',
            districtName: user?.district || 'Pune',
            talukaId: user?.talukaId || 'TAL_HAVELI',
            talukaName: user?.taluka || 'Haveli',
            villageId: user?.villageId || 'LOC_PAUD',
            villageName: user?.village || 'Paud',
            departmentCode: 'RESIDENT',
            roleCode: 'RESIDENT',
          };
          setAuthToken(token);
          setAuthUser(user);
          setJurisdiction(jur);
          saveSession(token, user, 'RESIDENT_APP', jur);
          setCurrentRoute('RESIDENT_APP');
        }}
        onBackToLanding={() => navigateTo('LANDING')}
      />
    );
  }

  // STAGE 2: Resident Locality Selector
  if (currentRoute === 'RESIDENT_JURISDICTION') {
    return (
      <LocationJurisdictionSelector
        portal="RESIDENT"
        user={authUser}
        onProceed={(selectedLoc) => {
          updateJurisdictionState(selectedLoc);
          navigateTo('RESIDENT_APP');
        }}
      />
    );
  }

  // STAGE 2: Resident Application Shell
  if (currentRoute === 'RESIDENT_APP') {
    return (
      <ResidentDashboard
        user={authUser}
        location={jurisdiction}
        onLogout={handleLogout}
        onOpenGisMap={() => navigateTo('RESIDENT_MAP')}
        onSelectParcel={(ulpin) => setSelectedUlpin(ulpin)}
      />
    );
  }

  // STAGE 2: Resident GIS Map View
  if (currentRoute === 'RESIDENT_MAP') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <header className="h-16 bg-blue-950 text-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('RESIDENT_APP')}
              className="text-xs font-extrabold text-blue-200 hover:text-white flex items-center gap-1.5 bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-xl shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Resident Dashboard</span>
            </button>
            <span className="text-xs font-black text-white">
              Resident Cadastral GIS Map ({jurisdiction.villageName}, {jurisdiction.talukaName})
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-blue-900 border border-blue-800 text-blue-200 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 relative">
          <GisMapViewer
            selectedState={jurisdiction.stateId}
            selectedVillage={jurisdiction.villageId}
            selectedUlpin={selectedUlpin}
            onSelectParcel={(ulpin) => setSelectedUlpin(ulpin)}
            onOpenFullDossier={(ulpin) => setSelectedUlpin(ulpin)}
          />
        </div>

        {selectedUlpin && (
          <ParcelDetailModal
            ulpin={selectedUlpin}
            onClose={() => setSelectedUlpin(null)}
          />
        )}
      </div>
    );
  }

  // STAGE 2: Government Portal Login
  if (currentRoute === 'GOVERNMENT_LOGIN') {
    return (
      <GovernmentLogin
        onLoginSuccess={(token, user) => {
          const jur = {
            stateId: user?.stateId || 'ST_MH',
            stateName: user?.state || 'Maharashtra',
            districtId: user?.districtId || 'DIST_PUNE',
            districtName: user?.district || 'Pune',
            talukaId: user?.talukaId || 'TAL_HAVELI',
            talukaName: user?.taluka || 'Haveli',
            villageId: user?.villageId || 'LOC_PAUD',
            villageName: user?.village || 'Paud',
            departmentCode: user?.department || 'REVENUE',
            roleCode: user?.role || 'REVENUE_OFFICER',
          };
          setAuthToken(token);
          setAuthUser(user);
          setUserRole(user?.role || 'REVENUE_OFFICER');
          setJurisdiction(jur);
          saveSession(token, user, 'GOVERNMENT_APP', jur);
          setCurrentRoute('GOVERNMENT_APP');
        }}
        onBackToLanding={() => navigateTo('LANDING')}
      />
    );
  }

  // STAGE 2: Government Jurisdiction Selector
  if (currentRoute === 'GOVERNMENT_JURISDICTION') {
    return (
      <LocationJurisdictionSelector
        portal="GOVERNMENT"
        user={authUser}
        onProceed={(selectedJurisdiction) => {
          updateJurisdictionState(selectedJurisdiction);
          setUserRole(selectedJurisdiction.roleCode || 'REVENUE_OFFICER');
          navigateTo('GOVERNMENT_APP');
        }}
      />
    );
  }

  // STAGE 2: Authenticated Government Portal Shell
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      
      {/* Top Government Header Strip */}
      <div className="bg-blue-950 text-white text-[11px] px-6 py-1 flex items-center justify-between font-semibold border-b border-blue-900">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-blue-300" />
          <span>Government of India Digital Public Infrastructure | Integrated Land Governance</span>
        </div>
        <div className="flex items-center gap-3 text-blue-200">
          <span>Role: <strong>{userRole}</strong></span>
          <span>•</span>
          <span>Department: <strong>{jurisdiction.departmentCode || 'REVENUE'}</strong></span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shadow-sm">
        
        <div className="flex items-center gap-3.5">
          <div className="bg-blue-900 text-white p-2 rounded-xl shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-lg tracking-tight flex items-center gap-2">
              <span>LAND STACK</span>
              <span className="text-[10px] bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full font-extrabold border border-blue-200">
                OFFICIAL GOVT PORTAL
              </span>
            </h1>
            <p className="text-[11px] text-slate-600 font-semibold hidden sm:block">
              {jurisdiction.departmentCode || 'REVENUE'} Department — {jurisdiction.stateName} ({jurisdiction.talukaName})
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('government')}
            className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'government' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Department Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'map' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cadastral GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_governance')}
            className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'ai_governance' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decision Support AI</span>
          </button>
        </div>

        {/* Right Search, Assistant & Logout Toolbar */}
        <div className="flex items-center gap-4">
          
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search ULPIN (e.g. MH-27-PUN-000003)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold pl-8 pr-4 py-1.5 rounded-xl focus:border-blue-700 focus:outline-none w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className={`p-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 transition-colors ${
              showAssistant
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Bot className="w-4 h-4 text-blue-700" />
            <span className="hidden lg:inline">Land Assistant</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* Main App Body View */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col">
            <LocalitySelector
              selectedState={jurisdiction.stateId}
              selectedDistrict={jurisdiction.districtId}
              selectedTaluka={jurisdiction.talukaId}
              selectedVillage={jurisdiction.villageId}
              onStateChange={(st) => updateJurisdictionState({ ...jurisdiction, stateId: st })}
              onDistrictChange={(dt) => updateJurisdictionState({ ...jurisdiction, districtId: dt })}
              onTalukaChange={(tk) => updateJurisdictionState({ ...jurisdiction, talukaId: tk })}
              onVillageChange={(vg) => updateJurisdictionState({ ...jurisdiction, villageId: vg })}
            />
            <div className="flex-1 relative">
              <GisMapViewer
                selectedState={jurisdiction.stateId}
                selectedVillage={jurisdiction.villageId}
                selectedUlpin={selectedUlpin}
                onSelectParcel={(ulpin: string) => setSelectedUlpin(ulpin)}
                onOpenFullDossier={(ulpin: string) => setSelectedUlpin(ulpin)}
              />
            </div>
          </div>
        )}

        {activeTab === 'government' && (
          <div className="flex-1 overflow-y-auto p-6">
            <GovernmentDashboard
              activeRole={userRole}
              onRoleChange={(r: string) => setUserRole(r)}
            />
          </div>
        )}

        {activeTab === 'ai_governance' && (
          <div className="flex-1 overflow-y-auto p-6">
            <AiGovernanceDashboard />
          </div>
        )}
      </main>

      {/* Selected Parcel Dossier Modal */}
      {selectedUlpin && (
        <ParcelDetailModal
          ulpin={selectedUlpin}
          onClose={() => setSelectedUlpin(null)}
        />
      )}

      {/* AI Natural Language Assistant Drawer */}
      {showAssistant && (
        <LandAssistant
          ulpin={selectedUlpin || 'MH-27-PUN-000003'}
          onClose={() => setShowAssistant(false)}
        />
      )}

    </div>
  );
}
