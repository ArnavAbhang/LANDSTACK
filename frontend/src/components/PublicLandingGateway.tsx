import React from 'react';
import { Layers, ShieldCheck, MapPin, Building2, Cpu, UserCheck, ArrowRight, Lock, FileText, CheckCircle2, Globe, Scale, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface PublicLandingGatewayProps {
  onSelectPortal: (portal: 'RESIDENT' | 'GOVERNMENT') => void;
}

export const PublicLandingGateway: React.FC<PublicLandingGatewayProps> = ({ onSelectPortal }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Government Header Strip */}
      <div className="bg-blue-950 text-white text-[11px] px-6 lg:px-12 py-1.5 flex items-center justify-between font-semibold border-b border-blue-900">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-blue-300" />
          <span>{t('gov_banner_title', 'Government of India Digital Public Infrastructure | Integrated Land Governance')}</span>
        </div>
        <div className="flex items-center gap-4 text-blue-200">
          <span className="hidden md:inline">{t('accessibility', 'Accessibility')}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{t('help_support', 'Help & Support')}</span>
          <span className="hidden md:inline">•</span>
          <LanguageSelector variant="dark" compact={false} />
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="bg-blue-900 text-white p-2.5 rounded-xl shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2">
              <span>LAND STACK</span>
              <span className="text-[10px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-extrabold border border-blue-200">
                {t('dpi_platform_badge', 'Official DPI Platform')}
              </span>
            </h1>
            <p className="text-xs text-slate-600 font-medium hidden sm:block">
              {t('hero_badge', 'Integrated Digital Land Governance')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => onSelectPortal('RESIDENT')}
            className="font-bold text-slate-700 hover:text-blue-900 px-4 py-2.5 transition-colors rounded-xl border border-slate-200 hover:border-slate-300 bg-white"
          >
            {t('resident_portal', 'Resident Portal')}
          </button>
          <button
            onClick={() => onSelectPortal('GOVERNMENT')}
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-blue-200" />
            <span>{t('government_portal', 'Government Portal')}</span>
          </button>
          <div className="hidden sm:block">
            <LanguageSelector variant="light" compact={false} />
          </div>
        </div>
      </header>

      {/* SECTION 1: Hero Section with Light Cartographic GIS Visual */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-20 bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs text-blue-900 font-extrabold">
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>National Digital Public Infrastructure for Land Governance</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              One Digital Platform for <br />
              <span className="text-blue-900">Integrated Land Governance</span>
            </h2>

            <p className="text-slate-700 text-base leading-relaxed max-w-2xl font-medium">
              Access land information, spatial services and citizen workflows through a secure, parcel-centric digital platform connecting Revenue, Deed Registration, Property Tax, Urban Planning, and Location Intelligence.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectPortal('RESIDENT')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Resident Portal Entry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectPortal('GOVERNMENT')}
                className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs"
              >
                <Building2 className="w-4 h-4 text-blue-200" />
                <span>Government Official Entry</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Light Cartographic GIS Hero Visual (Non-Operational) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span className="font-extrabold text-slate-900 text-xs">Spatial Cadastral GIS Overlay</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-extrabold">
                ULPIN GIS Standard
              </span>
            </div>

            {/* Light Cartographic Graphic Illustration */}
            <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-4">
              {/* Abstract Map Grid Lines */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Illustrative Cadastral Shapes */}
              <svg className="w-full h-full text-slate-400" viewBox="0 0 300 200" fill="none" stroke="currentColor">
                <polygon points="30,30 110,20 130,90 40,100" className="fill-emerald-100/60 stroke-emerald-600 stroke-2" />
                <polygon points="110,20 220,15 240,80 130,90" className="fill-blue-100/60 stroke-blue-600 stroke-2" />
                <polygon points="40,100 130,90 140,170 50,180" className="fill-purple-100/60 stroke-purple-600 stroke-2" />
                <polygon points="130,90 240,80 260,165 140,170" className="fill-amber-100/60 stroke-amber-600 stroke-2" />
                
                {/* Node Points */}
                <circle cx="130" cy="90" r="4" className="fill-blue-700 stroke-white stroke-2" />
                <circle cx="110" cy="20" r="3" className="fill-blue-600" />
                <circle cx="240" cy="80" r="3" className="fill-blue-600" />
              </svg>

              {/* Central Badge Overlay */}
              <div className="absolute bg-white/95 backdrop-blur border border-slate-300 px-4 py-2 rounded-xl text-center shadow-md space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spatial Data Model</span>
                <div className="text-xs font-black text-blue-900 font-mono">14-Digit ULPIN Parcel Anchor</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 text-center font-medium">
              Illustrative representation of parcel-centric spatial GIS overlay and connected land records.
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Connected Land Information */}
      <section className="px-6 lg:px-12 py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Connected Land Information</h3>
            <p className="text-xs text-slate-600 font-medium">
              Unifying legacy department silos into a coherent, accessible land information system.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Land Records</h4>
              <p className="text-slate-600 leading-relaxed">Integrated RoRs (7/12, Patta, Jamabandi) and verified ownership shares.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Cadastral GIS</h4>
              <p className="text-slate-600 leading-relaxed">MapLibre GIS visualization with exact boundary geometries and master plan overlays.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Deed Registration</h4>
              <p className="text-slate-600 leading-relaxed">SRO deed encumbrance verification and mutation record linkage.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Property Tax & Planning</h4>
              <p className="text-slate-600 leading-relaxed">Municipal tax tracking, zoning clearance, and flood risk overlays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Built Around the Land Parcel */}
      <section className="px-6 lg:px-12 py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 border border-blue-200 px-3.5 py-1 rounded-full font-extrabold">
              <span>Canonical Parcel Standard</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Built Around the Land Parcel</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              Every parcel in LAND STACK is anchored by its Unique Land Parcel Identification Number (ULPIN). This spatial identity links ownership records, spatial geometries, litigation history, and tax status into a single authoritative record.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 font-mono shadow-sm">
            <div className="text-blue-900 font-black text-base border-b border-slate-200 pb-2">ULPIN: MH-27-PUN-000003</div>
            <div className="text-slate-700 space-y-1.5 text-xs font-semibold">
              <div>State / District: Maharashtra / Pune</div>
              <div>Taluka / Village: Haveli / Paud</div>
              <div>Survey Number: 125/1</div>
              <div>Area: 3.10 Hectares</div>
              <div>Primary Owner: Rahul Anil Deshmukh</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Designed for India's Diverse Land Systems */}
      <section className="px-6 lg:px-12 py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Designed for India's Diverse Land Systems</h3>
            <p className="text-xs text-slate-600 font-medium">State-aware adapters normalize heterogeneous state data models into a unified DPI standard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-lg">Maharashtra</h4>
              <p className="text-emerald-700 font-extrabold">7/12 Extract • 8A • Ferfar Mutation</p>
              <p className="text-slate-600 leading-relaxed font-medium">Ingests Khata numbers, survey sub-divisions, and Ferfar mutation notes from MahaBhulekh.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-lg">Tamil Nadu</h4>
              <p className="text-blue-700 font-extrabold">Patta • Chitta • Adangal</p>
              <p className="text-slate-600 leading-relaxed font-medium">Ingests Patta holder details, Nanjai/Punjai classification, and SRO Sriperumbudur registrations.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-lg">Punjab</h4>
              <p className="text-purple-700 font-extrabold">Jamabandi • Fard • Intqal</p>
              <p className="text-slate-600 leading-relaxed font-medium">Ingests Khewat/Khatoni numbers, Murabba/Khasra details, and PLRS mutation records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Access Call-to-Action Banner */}
      <section className="px-6 lg:px-12 py-16 bg-blue-950 text-white text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-2">
          <h3 className="text-3xl font-black">Access LAND STACK</h3>
          <p className="text-xs text-blue-200 font-medium">Select your entry portal to access digital land services and governance workflows.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <button
            onClick={() => onSelectPortal('RESIDENT')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Resident Portal</span>
          </button>

          <button
            onClick={() => onSelectPortal('GOVERNMENT')}
            className="bg-white hover:bg-slate-100 text-blue-950 font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-blue-900" />
            <span>Government Portal</span>
          </button>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 lg:px-12 py-8 text-xs flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-800">
        <div>
          <strong className="text-white">LAND STACK</strong> | Integrated Digital Land Governance
        </div>

        <div className="flex flex-wrap gap-6 text-slate-300 text-[11px]">
          <span className="hover:text-white cursor-pointer">About</span>
          <span className="hover:text-white cursor-pointer">Services</span>
          <span className="hover:text-white cursor-pointer">Help & Documentation</span>
          <span className="hover:text-white cursor-pointer">Privacy & Security</span>
          <span className="hover:text-white cursor-pointer">Accessibility</span>
        </div>
      </footer>

    </div>
  );
};
