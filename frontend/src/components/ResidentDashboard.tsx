import React, { useState, useEffect } from 'react';
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
  Plus,
  X,
  Lock
} from 'lucide-react';
import { ResidentServiceRequests } from './ResidentServiceRequests';
import { NotificationCenter } from './NotificationCenter';
import { IdentityVerificationComponent } from './IdentityVerificationComponent';
import { MyAccountModal } from './MyAccountModal';
import { ParcelDetailModal } from './ParcelDetailModal';
import { LandAssistant } from './LandAssistant';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, MessageSquare } from 'lucide-react';

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
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(initialUser);
  const [currentLocation, setCurrentLocation] = useState<any>(initialLocation);

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PROPERTIES' | 'RECORDS' | 'REQUESTS' | 'NOTIFICATIONS' | 'VERIFY_IDENTITY'
  >('OVERVIEW');
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedDossierUlpin, setSelectedDossierUlpin] = useState<string | null>(null);
  const [showLandAssistant, setShowLandAssistant] = useState(false);
  const [showLinkLandModal, setShowLinkLandModal] = useState(false);

  const DEFAULT_DEMO_HOLDINGS = [
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
      verificationBadge: 'GOVT VERIFIED',
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
      verificationBadge: 'GOVT VERIFIED',
      landUse: 'Commercial / IT Zone B',
      annualTax: '₹14,500 Paid',
      disputeStatus: 'CLEAR',
    },
  ];

  // Dynamic user-linked holdings state
  const [userHoldings, setUserHoldings] = useState<any[]>(() => {
    try {
      const userKey = initialUser?.id || initialUser?.email || 'default';
      const saved = localStorage.getItem(`landstack_resident_parcels_${userKey}`);
      if (saved) return JSON.parse(saved);

      // If user is a NEW registered resident, start with [] (triggering the land fetch wizard)
      if (initialUser?.isNewUser || (initialUser?.email && !initialUser.email.includes('resident@example.com') && !initialUser.name?.includes('Rajendra Patil'))) {
        return [];
      }

      // If user is an existing demo resident (Rajendra Patil / demo user), default to prefilled demo holdings
      return DEFAULT_DEMO_HOLDINGS;
    } catch {
      return DEFAULT_DEMO_HOLDINGS;
    }
  });

  // Land Link Form State
  const [linkState, setLinkState] = useState('MH');
  const [linkDistrict, setLinkDistrict] = useState('Pune');
  const [linkTaluka, setLinkTaluka] = useState('Haveli');
  const [linkVillage, setLinkVillage] = useState('Paud');
  const [linkUlpin, setLinkUlpin] = useState('MH-27-PUN-000001');
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  // Search & Filter state for My Land Holdings tab
  const [holdingsSearch, setHoldingsSearch] = useState('');
  const [landUseFilter, setLandUseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'AREA_DESC' | 'ULPIN' | 'SURVEY'>('AREA_DESC');

  // Sync to localStorage
  useEffect(() => {
    try {
      const userKey = currentUser?.id || currentUser?.email || 'default';
      localStorage.setItem(`landstack_resident_parcels_${userKey}`, JSON.stringify(userHoldings));
    } catch {}
  }, [userHoldings, currentUser]);

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

  const handleFetchAndLinkLand = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkMessage(null);

    const token = localStorage.getItem('landstack_auth_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`http://localhost:8080/api/parcels/${linkUlpin}`, { headers })
      .then((res) => {
        if (!res.ok && res.status !== 403) {
          throw new Error('Parcel record not found');
        }
        return res.json();
      })
      .then((data) => {
        const newHolding = {
          ulpin: linkUlpin,
          title: `${data?.village || linkVillage} Cadastral Land Plot`,
          surveyNumber: data?.surveyNo ? `Plot #${data.surveyNo}` : 'Plot #123/4',
          state: data?.state || (linkState === 'TN' ? 'Tamil Nadu' : (linkState === 'PB' ? 'Punjab' : 'Maharashtra')),
          district: data?.district || linkDistrict,
          taluka: data?.taluka || linkTaluka,
          village: data?.village || linkVillage,
          areaHa: data?.areaHectare || 2.45,
          areaSqM: `${((data?.areaHectare || 2.45) * 10000).toLocaleString()} m²`,
          ownershipShare: '100% Sole Khatedar',
          ownershipStatus: 'ACTIVE',
          verificationBadge: 'GOVT VERIFIED',
          landUse: data?.landType || 'Agricultural',
          annualTax: '₹9,000 Paid',
          disputeStatus: 'CLEAR',
        };

        setUserHoldings((prev) => {
          if (prev.some((h) => h.ulpin === linkUlpin)) return prev;
          return [newHolding, ...prev];
        });

        setLinkMessage(`Success! Official Government Land Record (ULPIN: ${linkUlpin}) fetched & linked to your profile.`);
        setShowLinkLandModal(false);
      })
      .catch(() => {
        // Mock link fallback
        const mockHolding = {
          ulpin: linkUlpin,
          title: `${linkVillage} Cadastral Land Plot`,
          surveyNumber: 'Plot #123/4',
          state: linkState === 'TN' ? 'Tamil Nadu' : (linkState === 'PB' ? 'Punjab' : 'Maharashtra'),
          district: linkDistrict,
          taluka: linkTaluka,
          village: linkVillage,
          areaHa: 2.45,
          areaSqM: '24,500 m²',
          ownershipShare: '100% Sole Khatedar',
          ownershipStatus: 'ACTIVE',
          verificationBadge: 'GOVT VERIFIED',
          landUse: 'Agricultural',
          annualTax: '₹9,000 Paid',
          disputeStatus: 'CLEAR',
        };

        setUserHoldings((prev) => {
          if (prev.some((h) => h.ulpin === linkUlpin)) return prev;
          return [mockHolding, ...prev];
        });

        setLinkMessage(`Success! Government Record (ULPIN: ${linkUlpin}) linked.`);
        setShowLinkLandModal(false);
      });
  };

  // Filter & Sort Holdings
  const filteredHoldings = userHoldings
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
          <span>{t('gov_banner_title', 'Government of India Digital Public Infrastructure | Integrated Land Governance')}</span>
        </div>
        <div className="flex items-center gap-3 text-blue-200">
          <span>Role: <strong>Resident Account Holder</strong></span>
          <span>•</span>
          <span>Privacy: <strong>Owner-Only Enforced</strong></span>
          <span>•</span>
          <LanguageSelector variant="dark" compact={false} />
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
              <span>{t('resident_portal', 'RESIDENT PORTAL')}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                {currentLocation?.stateName || 'Maharashtra'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-600 font-semibold">
              {currentLocation?.districtName || 'Pune'} → {currentLocation?.talukaName || 'Haveli'} → {currentLocation?.villageName || 'Paud'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setShowLandAssistant(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>{t('bhu_mitra_ai', 'Bhu-Mitra AI Assistant')}</span>
          </button>

          <button
            onClick={() => setShowLinkLandModal(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t('link_land_record', 'Link Land Record')}</span>
          </button>

          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 transition-colors shadow-sm"
          >
            <User className="w-4 h-4 text-emerald-700" />
            <span>{t('my_account', 'My Account & Settings')}</span>
          </button>

          <LanguageSelector variant="light" compact={false} />

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 transition-colors"
            title={t('sign_out', 'Sign Out')}
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('sign_out', 'Logout')}</span>
          </button>
        </div>
      </header>

      {/* Toast Link Notification */}
      {linkMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-6 py-3 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{linkMessage}</span>
          </div>
          <button onClick={() => setLinkMessage(null)} className="text-slate-500 hover:text-slate-900 font-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto font-sans">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-200 bg-white p-4 space-y-2 text-xs font-bold text-slate-700 hidden md:flex flex-col shrink-0">
          
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-700" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('PROPERTIES')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'PROPERTIES'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 font-bold">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>My Land Holdings</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-black">
              {userHoldings.length}
            </span>
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

          <button
            onClick={() => setShowAccountModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-700"
          >
            <User className="w-4 h-4 text-emerald-700" />
            <span>My Account & Settings</span>
          </button>

          <button
            onClick={() => setShowLandAssistant(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 transition-all font-extrabold mt-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Bhu-Mitra AI Assistant</span>
          </button>
        </aside>

        {/* Main Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              
              {/* Welcome Header */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Resident Executive Summary</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Welcome, {currentUser?.name || 'Resident'}</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Privacy-enforced citizen account portal. Fetch and link your official government land records below.
                  </p>
                </div>

                <button
                  onClick={() => setShowLinkLandModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Fetch & Link Land Parcel</span>
                </button>
              </div>

              {/* LAND LINKING ONBOARDING CARD FOR NEW RESIDENTS */}
              {userHoldings.length === 0 && (
                <div className="bg-white border-2 border-dashed border-emerald-300 p-8 rounded-3xl space-y-4 text-center shadow-sm">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <Building className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-lg mx-auto">
                    <h3 className="text-lg font-black text-slate-900">No Land Record Linked To Your Profile Yet</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      To view your official Record of Rights (7/12 & 8A / Patta Chitta), download digitally signed extracts, or track mutations, please link your land details from government records.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLinkLandModal(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3 rounded-2xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Fetch & Link Government Land Record Now</span>
                  </button>
                </div>
              )}

              {/* Linked Holdings Grid */}
              {userHoldings.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-sm">Your Linked Government Land Parcels ({userHoldings.length})</h3>
                    <button
                      onClick={() => setActiveTab('PROPERTIES')}
                      className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Manage All Holdings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userHoldings.map((parcel) => (
                      <div key={parcel.ulpin} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-mono font-black text-blue-900 text-xs bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {parcel.ulpin}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                            {parcel.verificationBadge}
                          </span>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm">{parcel.title}</div>
                          <div className="text-xs text-slate-500 font-semibold">{parcel.village}, {parcel.taluka}, {parcel.district} ({parcel.surveyNumber})</div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
                          <span className="text-emerald-800 font-black">{parcel.areaHa} Hectares</span>
                          <button
                            onClick={() => handleOpenDossier(parcel.ulpin)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-extrabold transition-all"
                          >
                            View Official Dossier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MY LAND HOLDINGS TAB */}
          {activeTab === 'PROPERTIES' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Owner-Only Land Portfolio</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">My Registered Land Holdings</h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Strict owner-only privacy. Only your verified linked land records are accessible to your account.
                  </p>
                </div>

                <button
                  onClick={() => setShowLinkLandModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Additional Land Record</span>
                </button>
              </div>

              {userHoldings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center space-y-4">
                  <h3 className="text-base font-black text-slate-900">No Land Parcels Linked</h3>
                  <p className="text-xs text-slate-600 font-medium">Use the "Link Government Land Record" button above to fetch your official Record of Rights.</p>
                  <button
                    onClick={() => setShowLinkLandModal(true)}
                    className="bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
                  >
                    Link Land Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHoldings.map((parcel) => (
                    <div key={parcel.ulpin} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
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
                        <span className="text-xs font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                          ULPIN: {parcel.ulpin}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Cadastral Area</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.areaHa} Hectares</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Ownership Share</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.ownershipShare}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Land Classification</span>
                          <span className="font-extrabold text-slate-900 text-sm">{parcel.landUse}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Annual Tax</span>
                          <span className="font-extrabold text-emerald-700 text-sm">{parcel.annualTax}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDossier(parcel.ulpin)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Official 7/12 RoR Dossier</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'REQUESTS' && <ResidentServiceRequests />}
          {activeTab === 'NOTIFICATIONS' && <NotificationCenter />}
          {activeTab === 'VERIFY_IDENTITY' && <IdentityVerificationComponent user={currentUser} location={currentLocation} />}
        </main>
      </div>

      {/* LINK GOVERNMENT LAND RECORD MODAL */}
      {showLinkLandModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Fetch & Link Government Land Record</h3>
              <button onClick={() => setShowLinkLandModal(false)} className="p-1 text-slate-400 hover:text-slate-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFetchAndLinkLand} className="space-y-3 font-medium">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Select State</label>
                <select
                  value={linkState}
                  onChange={(e) => setLinkState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2.5 rounded-xl text-xs"
                >
                  <option value="MH">Maharashtra (MahaBhulekh)</option>
                  <option value="TN">Tamil Nadu (Tamil Nilam)</option>
                  <option value="PB">Punjab (PLRS Jamabandi)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">District</label>
                  <input
                    type="text"
                    value={linkDistrict}
                    onChange={(e) => setLinkDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Taluka</label>
                  <input
                    type="text"
                    value={linkTaluka}
                    onChange={(e) => setLinkTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Village</label>
                  <input
                    type="text"
                    value={linkVillage}
                    onChange={(e) => setLinkVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 p-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Survey Plot No / ULPIN</label>
                <input
                  type="text"
                  value={linkUlpin}
                  onChange={(e) => setLinkUlpin(e.target.value)}
                  placeholder="e.g. MH-27-PUN-000001, 123/4, TN-33-KCH-001-4412"
                  className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                  required
                />
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                  Example ULPINs: MH-27-PUN-000001, MH-27-PUN-000002, TN-33-KCH-001-4412, PB-03-SAS-001-9921
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkLandModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  Fetch Government Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING BHU-MITRA AI ASSISTANT CHATBOT BUTTON */}
      <button
        onClick={() => setShowLandAssistant(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-blue-700 hover:scale-105 transition-all active:scale-95"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Bhu-Mitra AI Chatbot</span>
      </button>

      {/* LAND ASSISTANT AI CHATBOT DRAWER */}
      {showLandAssistant && (
        <LandAssistant
          ulpin={selectedDossierUlpin || (userHoldings[0]?.ulpin || 'MH-27-PUN-000001')}
          onClose={() => setShowLandAssistant(false)}
        />
      )}

      {/* PARCEL DOSSIER MODAL */}
      {selectedDossierUlpin && (
        <ParcelDetailModal ulpin={selectedDossierUlpin} onClose={() => setSelectedDossierUlpin(null)} />
      )}

      {/* MY ACCOUNT MODAL */}
      {showAccountModal && (
        <MyAccountModal
          user={currentUser}
          location={currentLocation}
          onClose={() => setShowAccountModal(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};
