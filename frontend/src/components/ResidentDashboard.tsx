import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  UserCheck,
  LogOut,
  ShieldCheck,
  Home,
  FileText,
  Map,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Bell,
  Globe,
  User,
  Key,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Download,
  Building,
  Clock,
  ShieldAlert,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { ResidentServiceRequests } from './ResidentServiceRequests';
import { NotificationCenter } from './NotificationCenter';
import { IdentityVerificationComponent } from './IdentityVerificationComponent';
import { MyAccountModal } from './MyAccountModal';
import { ParcelDetailModal } from './ParcelDetailModal';

interface ResidentDashboardProps {
  user: any;
  location: any;
  onLogout: () => void;
  onOpenGisMap: () => void;
  onSelectParcel: (ulpin: string) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  user: initialUser,
  location: initialLocation,
  onLogout,
  onOpenGisMap,
  onSelectParcel,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(initialUser);
  const [currentLocation, setCurrentLocation] = useState<any>(initialLocation);

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PROPERTIES' | 'RECORDS' | 'REQUESTS' | 'NOTIFICATIONS' | 'VERIFY_IDENTITY'
  >('OVERVIEW');
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedDossierUlpin, setSelectedDossierUlpin] = useState<string | null>(null);

  // Search & Filter state for My Land Holdings tab
  const [holdingsSearch, setHoldingsSearch] = useState('');
  const [landUseFilter, setLandUseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'AREA_DESC' | 'ULPIN' | 'SURVEY'>('AREA_DESC');

  // Terminology helper based on selected state
  const getStateTerm = (term: 'ROR' | 'MUTATION' | 'TAX') => {
    const st = currentLocation?.stateName || 'Maharashtra';
    if (st.includes('Tamil')) {
      if (term === 'ROR') return 'Patta & Chitta Extract';
      if (term === 'MUTATION') return 'Patta Transfer Request';
      return 'Property Tax Receipt';
    } else if (st.includes('Punjab')) {
      if (term === 'ROR') return 'Jamabandi Fard Extract';
      if (term === 'MUTATION') return 'Intqal Mutation Request';
      return 'Land Revenue Tax';
    } else {
      if (term === 'ROR') return '7/12 & 8A Extract';
      if (term === 'MUTATION') return 'Ferfar Mutation Request';
      return 'Property Tax & Cess';
    }
  };

  const handleUpdateUser = (updatedUser: any, updatedLocation: any) => {
    setCurrentUser(updatedUser);
    setCurrentLocation(updatedLocation);
  };

  // Sample Holdings Data for My Land Holdings Section
  const holdingsData = [
    {
      ulpin: 'MH-27-PUN-000001',
      title: 'Paud Agricultural Cadastral Plot',
      surveyNumber: 'Plot #123/4',
      state: currentLocation?.stateName || 'Maharashtra',
      district: currentLocation?.districtName || 'Pune',
      taluka: currentLocation?.talukaName || 'Haveli',
      village: currentLocation?.villageName || 'Paud',
      areaHa: 2.45,
      areaSqM: '24,500 m²',
      ownershipShare: '100% Sole Khatedar',
      ownershipStatus: 'ACTIVE',
      verificationBadge: 'VERIFIED',
      landUse: 'Agricultural (Irrigated)',
      annualTax: '₹9,000 Paid',
      disputeStatus: 'CLEAR',
    },
    {
      ulpin: 'MH-27-PUN-000002',
      title: 'Hinjawadi IT Park Sector Plot',
      surveyNumber: 'Plot #45/A',
      state: currentLocation?.stateName || 'Maharashtra',
      district: currentLocation?.districtName || 'Pune',
      taluka: 'Mulshi',
      village: 'Hinjawadi',
      areaHa: 1.80,
      areaSqM: '18,000 m²',
      ownershipShare: '50% Joint Khatedar (with S. K. Deshmukh)',
      ownershipStatus: 'ACTIVE',
      verificationBadge: 'VERIFIED',
      landUse: 'Commercial / IT Zone B',
      annualTax: '₹14,500 Paid',
      disputeStatus: 'CLEAR',
    },
  ];

  // Filter & Sort Holdings
  const filteredHoldings = holdingsData
    .filter((item) => {
      const matchSearch =
        item.ulpin.toLowerCase().includes(holdingsSearch.toLowerCase()) ||
        item.surveyNumber.toLowerCase().includes(holdingsSearch.toLowerCase()) ||
        item.village.toLowerCase().includes(holdingsSearch.toLowerCase());

      const matchUse = landUseFilter === 'ALL' || item.landUse.toLowerCase().includes(landUseFilter.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.ownershipStatus === statusFilter;

      return matchSearch && matchUse && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'AREA_DESC') return b.areaHa - a.areaHa;
      if (sortBy === 'ULPIN') return a.ulpin.localeCompare(b.ulpin);
      return a.surveyNumber.localeCompare(b.surveyNumber);
    });

  const handleOpenDossier = (ulpin: string) => {
    setSelectedDossierUlpin(ulpin);
    onSelectParcel(ulpin);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Government Header Strip */}
      <div className="bg-blue-950 text-white text-[11px] px-6 py-1 flex items-center justify-between font-semibold border-b border-blue-900">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-blue-300" />
          <span>Government of India Digital Public Infrastructure | Integrated Land Governance</span>
        </div>
        <div className="flex items-center gap-3 text-blue-200">
          <span>Role: <strong>Resident</strong></span>
          <span>•</span>
          <span>Session State: <strong>Authenticated</strong></span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 text-white p-2 rounded-xl shadow-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
              <span>RESIDENT PORTAL</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                {currentLocation?.stateName || 'Maharashtra'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-600 font-semibold">
              {currentLocation?.districtName || 'Pune'} → {currentLocation?.talukaName || 'Haveli'} → {currentLocation?.villageName || 'Paud'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Locality: <strong className="text-slate-900">{currentLocation?.villageName || 'Paud'}</strong></span>
          </div>

          {/* Profile & My Account Trigger */}
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 transition-colors shadow-sm"
          >
            <User className="w-4 h-4 text-emerald-700" />
            <span>{currentUser?.name || 'Rajendra Patil'}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">My Account</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Official Session Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-1.5 text-[11px] text-emerald-800 flex items-center justify-between font-semibold">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Authenticated Resident Session — {getStateTerm('ROR')} Active</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">Official Citizen Portal</div>
      </div>

      <div className="flex flex-1">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 text-xs font-bold text-slate-600 shadow-sm">
          
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-700" />
            <span>Overview Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('PROPERTIES')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'PROPERTIES'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-700" />
            <span>My Land Holdings</span>
          </button>

          <button
            onClick={onOpenGisMap}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all text-emerald-800"
          >
            <div className="flex items-center gap-2.5 font-bold">
              <Map className="w-4 h-4 text-emerald-700" />
              <span>Interactive GIS Map</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
          </button>

          <button
            onClick={() => setActiveTab('RECORDS')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'RECORDS'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>{getStateTerm('ROR')}</span>
          </button>

          <button
            onClick={() => setActiveTab('VERIFY_IDENTITY')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'VERIFY_IDENTITY'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-700" />
            <span>Profile / Identity Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'REQUESTS'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-emerald-700" />
            <span>Service Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Notifications</span>
          </button>

          <div className="pt-4 border-t border-slate-200 mt-auto">
            <button
              onClick={() => setShowAccountModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>My Account & Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW — PERSONAL SUMMARY */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              
              {/* Welcome Header */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Resident Executive Summary</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Welcome back, {currentUser?.name || 'Rajendra Patil'}</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Registered Citizen Profile in {currentLocation?.villageName || 'Paud'}, {currentLocation?.talukaName || 'Haveli'} ({currentLocation?.stateName || 'Maharashtra'})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('VERIFY_IDENTITY')}
                    className="bg-blue-50 border border-blue-200 text-blue-900 font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Key className="w-4 h-4 text-blue-700" />
                    <span>Identity Status</span>
                  </button>

                  <button
                    onClick={onOpenGisMap}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
                  >
                    <Map className="w-4 h-4" />
                    <span>Launch Cadastral GIS Map</span>
                  </button>
                </div>
              </div>

              {/* 4 Concise Summary Metrics (No detailed parcel lists here!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Land Holdings</span>
                  <div className="text-2xl font-black text-slate-900">2 Land Holdings</div>
                  <p className="text-[11px] text-emerald-700 font-extrabold">4.25 Hectares Combined Area</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active & Disputed Summary</span>
                  <div className="text-2xl font-black text-emerald-700">2 Active</div>
                  <p className="text-[11px] text-slate-500 font-semibold">0 Active Disputes / Injunctions</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Requests</span>
                  <div className="text-2xl font-black text-amber-700">1 Request</div>
                  <p className="text-[11px] text-slate-500 font-semibold">Ferfar Mutation #REQ-2025-082</p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{getStateTerm('TAX')}</span>
                  <div className="text-2xl font-black text-emerald-700">CLEARED</div>
                  <p className="text-[11px] text-slate-500 font-semibold">₹23,500 Paid for FY 2025-26</p>
                </div>

              </div>

              {/* Two Column Summary Layout: Important Alerts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Important Alerts & Notices */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span>Important Portal Alerts & Governance Notices</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-bold">3 Active Alerts</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1 text-emerald-900">
                      <div className="font-extrabold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Aadhaar Identity Verification Active</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Your resident identity is verified via simulated Aadhaar provider. High-trust actions (mutations & title transfers) are unlocked for Person ID <code className="font-bold">LS-PER-00000125</code>.
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1 text-amber-900">
                      <div className="font-extrabold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>Revenue Mutation Request Under Review</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Mutation Request <code className="font-bold">#REQ-2025-082</code> for Paud Survey #123/4 has been submitted and is under active review by Tahashildar Haveli.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-1 text-blue-900">
                      <div className="font-extrabold flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-700" />
                        <span>Annual Property Tax Compliance Cleared</span>
                      </div>
                      <p className="text-[11px] text-blue-800">
                        Property tax for Paud Plot #123/4 and Hinjawadi Plot #45/A is cleared. Official digital tax receipt is available under {getStateTerm('TAX')}.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Right Column: Recent Activity Log & Quick Actions */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Recent Activity Card */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-700" />
                        <span>Recent Activity Log</span>
                      </h3>
                      <span className="text-[11px] text-slate-400 font-bold">Latest Timeline</span>
                    </div>

                    <div className="space-y-3 text-xs font-semibold">
                      <div className="flex items-start gap-3 border-l-2 border-emerald-600 pl-3 py-1">
                        <div>
                          <div className="font-bold text-slate-900">7/12 Extract Generated</div>
                          <div className="text-[11px] text-slate-500">ULPIN: MH-27-PUN-000001 • Today 09:30 AM</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 border-l-2 border-blue-600 pl-3 py-1">
                        <div>
                          <div className="font-bold text-slate-900">Aadhaar Identity Verification Confirmed</div>
                          <div className="text-[11px] text-slate-500">Mode: SIMULATED • Yesterday 04:15 PM</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 border-l-2 border-amber-600 pl-3 py-1">
                        <div>
                          <div className="font-bold text-slate-900">Submitted Mutation Request #REQ-2025-082</div>
                          <div className="text-[11px] text-slate-500">Haveli Revenue Office • Aug 29, 2026</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relevant Quick Actions Grid */}
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider text-slate-500">Quick Actions</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                      <button
                        onClick={() => setActiveTab('PROPERTIES')}
                        className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 transition-colors flex items-center justify-between"
                      >
                        <span>Manage Holdings</span>
                        <ChevronRight className="w-4 h-4 text-emerald-700" />
                      </button>

                      <button
                        onClick={onOpenGisMap}
                        className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl border border-blue-200 transition-colors flex items-center justify-between"
                      >
                        <span>GIS Map Viewer</span>
                        <ChevronRight className="w-4 h-4 text-blue-700" />
                      </button>

                      <button
                        onClick={() => setActiveTab('REQUESTS')}
                        className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span>Service Request</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>

                      <button
                        onClick={() => setShowAccountModal(true)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span>My Account</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY LAND HOLDINGS — DEDICATED LAND MANAGEMENT */}
          {activeTab === 'PROPERTIES' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Dedicated Parcel Portfolio Management</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">My Registered Land Holdings</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    View cadastral parcels, inspect ownership shares, filter land classifications, and launch 9-tab detailed parcel dossiers.
                  </p>
                </div>

                <button
                  onClick={onOpenGisMap}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  <span>View All on GIS Map</span>
                </button>
              </div>

              {/* Search, Filter & Sort Toolbar */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm text-xs font-semibold">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search ULPIN (e.g. MH-27-PUN-000001), Survey Plot #, or Locality..."
                    value={holdingsSearch}
                    onChange={(e) => setHoldingsSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold pl-9 pr-4 py-2 rounded-xl focus:border-emerald-700 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Land Use Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">Land Use:</span>
                    <select
                      value={landUseFilter}
                      onChange={(e) => setLandUseFilter(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Classifications</option>
                      <option value="Agricultural">Agricultural</option>
                      <option value="Commercial">Commercial / IT Zone</option>
                      <option value="Residential">Residential</option>
                    </select>
                  </div>

                  {/* Holding Status Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-500">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="ACTIVE">Active & Verified</option>
                      <option value="DISPUTED">Disputed</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="AREA_DESC">Area (High to Low)</option>
                      <option value="ULPIN">ULPIN Key</option>
                      <option value="SURVEY">Survey Plot Number</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Holdings List Cards */}
              <div className="space-y-4">
                {filteredHoldings.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500 font-semibold">
                    No registered land holdings match your search filter criteria.
                  </div>
                ) : (
                  filteredHoldings.map((parcel) => (
                    <div
                      key={parcel.ulpin}
                      className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-2xl shadow-sm transition-all space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-base">{parcel.title}</h3>
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded">
                              {parcel.verificationBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {parcel.state} → {parcel.district} → {parcel.taluka} → {parcel.village} ({parcel.surveyNumber})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                            ULPIN: {parcel.ulpin}
                          </span>
                        </div>
                      </div>

                      {/* Parcel Grid Attributes */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                        
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Cadastral Area</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.areaHa} Hectares</span>
                          <span className="text-[11px] text-slate-500 block font-mono">{parcel.areaSqM}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Ownership Share</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.ownershipShare}</span>
                          <span className="text-[11px] text-emerald-700 block font-bold">{parcel.ownershipStatus}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Land Classification</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.landUse}</span>
                          <span className="text-[11px] text-slate-500 block">Zoning Compliant</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">{getStateTerm('TAX')}</span>
                          <span className="font-extrabold text-emerald-700 text-sm">{parcel.annualTax}</span>
                          <span className="text-[11px] text-slate-500 block">Disputes: {parcel.disputeStatus}</span>
                        </div>

                      </div>

                      {/* Actions Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                        <div className="text-slate-500 text-[11px]">
                          Available Services: RoR Extract, Mutation History, Deed Registration, Tax Clearance, AI Risk Insights
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={onOpenGisMap}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <Map className="w-3.5 h-3.5 text-slate-600" />
                            <span>GIS View</span>
                          </button>

                          <button
                            onClick={() => handleOpenDossier(parcel.ulpin)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Full 9-Tab Dossier</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: RECORDS — RECORD OF RIGHTS (RoR / PATTA / JAMABANDI) */}
          {activeTab === 'RECORDS' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>Official Record of Rights (RoR) Digital Registry</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{getStateTerm('ROR')} Downloads</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Download officially signed digital extracts ({getStateTerm('ROR')}) anchored to ULPIN spatial keys.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenDossier('MH-27-PUN-000001')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Signed Extract</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs">
                <div className="font-bold text-slate-900 text-sm">Available Official Digital Extracts</div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[11px]">
                      <tr>
                        <th className="p-3">ULPIN Key</th>
                        <th className="p-3">Extract Type</th>
                        <th className="p-3">Survey Plot</th>
                        <th className="p-3">Issued Date</th>
                        <th className="p-3 text-right">Download Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-900">MH-27-PUN-000001</td>
                        <td className="p-3 font-bold">{getStateTerm('ROR')}</td>
                        <td className="p-3">Plot #123/4 (Paud)</td>
                        <td className="p-3">Today (Digitally Signed)</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenDossier('MH-27-PUN-000001')}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-lg hover:bg-emerald-100"
                          >
                            View & Download PDF
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-900">MH-27-PUN-000002</td>
                        <td className="p-3 font-bold">{getStateTerm('ROR')}</td>
                        <td className="p-3">Plot #45/A (Hinjawadi)</td>
                        <td className="p-3">Aug 28, 2026</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenDossier('MH-27-PUN-000002')}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-lg hover:bg-emerald-100"
                          >
                            View & Download PDF
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VERIFY_IDENTITY' && (
            <IdentityVerificationComponent user={currentUser} location={currentLocation} />
          )}

          {activeTab === 'REQUESTS' && (
            <ResidentServiceRequests />
          )}

          {activeTab === 'NOTIFICATIONS' && (
            <NotificationCenter />
          )}

        </main>
      </div>

      {/* My Account Modal */}
      {showAccountModal && (
        <MyAccountModal
          user={currentUser}
          location={currentLocation}
          onClose={() => setShowAccountModal(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Selected Parcel Full 9-Tab Dossier Modal */}
      {selectedDossierUlpin && (
        <ParcelDetailModal
          ulpin={selectedDossierUlpin}
          onClose={() => setSelectedDossierUlpin(null)}
        />
      )}

    </div>
  );
};
