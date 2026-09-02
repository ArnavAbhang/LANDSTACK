import React, { useState, useEffect } from 'react';
import { Database, Server, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play, Globe, Cpu, Satellite, FileText, Upload, Plus } from 'lucide-react';
import { DataImportWizard } from './DataImportWizard';

export const IntegrationHealthDashboard: React.FC = () => {
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [integrationJobs, setIntegrationJobs] = useState<any[]>([]);
  const [gisDatasets, setGisDatasets] = useState<any[]>([]);
  const [satelliteSources, setSatelliteSources] = useState<any[]>([]);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [syncingSource, setSyncingSource] = useState<string | null>(null);

  const fetchIntegrationData = () => {
    fetch('http://localhost:8080/api/integrations/sources')
      .then((res) => res.json())
      .then((data) => setDataSources(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/integrations/jobs')
      .then((res) => res.json())
      .then((data) => setIntegrationJobs(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/gis/datasets')
      .then((res) => res.json())
      .then((data) => setGisDatasets(data))
      .catch(() => {});

    fetch('http://localhost:8080/api/satellite/config')
      .then((res) => res.json())
      .then((data) => setSatelliteSources(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const handleSyncSource = (sourceId: string) => {
    setSyncingSource(sourceId);
    fetch(`http://localhost:8080/api/integrations/sync/${sourceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'GOV_ADMIN'
      }
    })
      .then(() => {
        setSyncingSource(null);
        fetchIntegrationData();
      })
      .catch(() => setSyncingSource(null));
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
            <Server className="w-3.5 h-3.5" />
            <span>State Systems Integration & Cadastral Pipelines</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            External Data Source Registry & GIS Integration Control Center
          </h2>
          <p className="text-xs text-slate-600 font-semibold">
            Monitors real state systems, cadastral dataset pipelines, CRS transformations, geometry validation, and satellite layers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWizard(!showWizard)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-200" />
            <span>Launch GeoJSON Import Wizard</span>
          </button>
        </div>
      </div>

      {/* Embedded Wizard Modal */}
      {showWizard && (
        <DataImportWizard
          onClose={() => setShowWizard(false)}
          onImportComplete={() => {
            fetchIntegrationData();
          }}
        />
      )}

      {/* External Data Source Registry Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-755" />
              <span>External Data Source Registry</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Production-oriented connector registry with explicit readiness status</p>
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold">Showing {dataSources.length} Sources</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          {dataSources.map((src: any, idx: number) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-1.5 font-medium">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-900">{src.sourceId}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    src.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' :
                    src.status === 'AVAILABLE' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    src.status === 'READY' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' :
                    'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">{src.sourceName}</div>
                <div className="text-[11px] text-slate-655 font-semibold">
                  Dept: <strong className="text-slate-900">{src.department}</strong> | State: <strong className="text-slate-900">{src.stateCode}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Protocol: {src.protocol} | Type: {src.sourceType}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Last Sync: {src.lastSyncAt ? src.lastSyncAt.substring(11, 19) : 'Just Now'}</span>
                <button
                  onClick={() => handleSyncSource(src.sourceId)}
                  disabled={syncingSource === src.sourceId}
                  className="bg-white hover:bg-slate-50 text-slate-800 px-2.5 py-1 rounded border border-slate-300 font-bold flex items-center gap-1 shadow-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingSource === src.sourceId ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Jobs Tracker & Satellite Data Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Integration Jobs */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-blue-755" />
            <span>Recent Integration Jobs ({integrationJobs.length})</span>
          </h3>

          <div className="space-y-2.5 text-xs font-semibold">
            {integrationJobs.map((job: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-slate-700 shadow-sm font-medium">
                <div>
                  <div className="font-mono font-bold text-blue-900">{job.jobId}</div>
                  <div className="text-[11px] text-slate-655 font-semibold">
                    Source: <strong className="text-slate-900">{job.sourceId}</strong> | Type: {job.jobType}
                  </div>
                </div>

                <div className="text-right space-y-0.5 font-semibold">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    job.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {job.status}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {job.recordsSucceeded} / {job.recordsReceived} Recs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Satellite Imagery Architecture */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Satellite className="w-5 h-5 text-purple-755" />
            <span>Satellite Imagery Tile Providers ({satelliteSources.length})</span>
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            {satelliteSources.map((sat: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 shadow-sm font-medium">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{sat.providerName}</span>
                  <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    {sat.tileType} ({sat.status})
                  </span>
                </div>
                <p className="text-slate-655 text-[11px] font-semibold">{sat.attribution}</p>
                <div className="text-[10px] font-mono text-emerald-800 truncate font-semibold">{sat.endpointTemplate}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
