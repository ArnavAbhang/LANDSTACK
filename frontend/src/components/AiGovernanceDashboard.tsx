import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Eye, Layers, Sparkles, UserCheck, ArrowRight, Camera } from 'lucide-react';

export const AiGovernanceDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [changeDetection, setChangeDetection] = useState<any>(null);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const fetchAlerts = () => {
    fetch('http://localhost:8080/api/ai/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(() => {});

    fetch('http://localhost:8000/api/ai/change-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ulpin: 'DEMO-MH-000004' })
    })
      .then((res) => res.json())
      .then((data) => setChangeDetection(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleOfficerAction = (alertId: string, action: string) => {
    fetch(`http://localhost:8080/api/ai/alerts/${alertId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        officerName: 'Tahashildar Haveli',
        comment: `Officer action ${action} recorded from AI Governance Portal`
      })
    })
      .then((res) => res.json())
      .then(() => fetchAlerts())
      .catch(() => {});
  };

  const filteredAlerts = filterRisk === 'ALL' ? alerts : alerts.filter((a) => a.riskLevel === filterRisk);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-slate-50 p-6 space-y-6 text-slate-900 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span>Decision Support & Risk Assessment Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">AI-Assisted Spatial Risk Analysis</h2>
          <p className="text-xs text-slate-655 mt-0.5 font-semibold">
            AI-generated decision support for boundary overlaps, dispute risk, mutation anomalies, and tax arrears.
          </p>
          <div className="mt-2 text-[11px] text-amber-800 font-extrabold bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg inline-block">
            Notice: AI-generated decision support. Final administrative decisions remain with authorized government officers.
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs font-bold shadow-sm">
          <span className="text-slate-600 font-semibold pl-2">Filter Risk:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-white border border-slate-350 text-slate-900 font-extrabold rounded-lg px-3 py-1.5 focus:ring-blue-700 focus:border-blue-705 shadow-sm"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk (76-100)</option>
            <option value="HIGH">High Risk (51-75)</option>
            <option value="MEDIUM">Medium Risk (21-50)</option>
            <option value="LOW">Low Risk (0-20)</option>
          </select>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Total AI Alerts</div>
          <div className="text-2xl font-black text-slate-900">{alerts.length} Active</div>
          <div className="text-[10px] text-slate-500 font-medium">Scanned across all parcels</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Critical Risk (76-100)</div>
          <div className="text-2xl font-black text-red-700">
            {alerts.filter((a) => a.riskLevel === 'CRITICAL').length} Parcels
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Requires immediate survey</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 font-bold uppercase text-[10px]">High Risk (51-75)</div>
          <div className="text-2xl font-black text-amber-700">
            {alerts.filter((a) => a.riskLevel === 'HIGH').length} Parcels
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Officer review recommended</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Medium Risk (21-50)</div>
          <div className="text-2xl font-black text-blue-900">
            {alerts.filter((a) => a.riskLevel === 'MEDIUM').length} Parcels
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Minor tax/utility warnings</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Human Actions Taken</div>
          <div className="text-2xl font-black text-emerald-700">
            {alerts.filter((a) => a.status !== 'NEW').length} Resolved
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Human-in-the-Loop audit</div>
        </div>
      </div>

      {/* AI Alert Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-755" />
            <span>AI Risk Detection Queue & Human Action Trigger</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">AI proposes signals; final decision rests with officer</span>
        </div>

        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse font-medium">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Alert ID</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Alert Type</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Finding & Evidence</th>
                <th className="p-3">AI Recommendation</th>
                <th className="p-3">Status</th>
                <th className="p-3">Officer Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {filteredAlerts.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-blue-900 font-bold">{alt.id}</td>
                  <td className="p-3 font-mono text-slate-900 font-bold">{alt.ulpin}</td>
                  <td className="p-3">
                    <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded font-extrabold text-[10px]">
                      {alt.alertType}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                      alt.riskLevel === 'CRITICAL' ? 'bg-red-50 text-red-800 border border-red-200' :
                      alt.riskLevel === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {alt.riskScore} / 100 ({alt.riskLevel})
                    </span>
                  </td>
                  <td className="p-3 max-w-xs space-y-1">
                    <div className="font-bold text-slate-900">{alt.finding}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{Array.isArray(alt.evidence) ? alt.evidence.join('; ') : alt.evidence}</div>
                  </td>
                  <td className="p-3 max-w-xs text-amber-700 font-extrabold text-[11px]">{alt.recommendation}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alt.status === 'INVESTIGATE' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      alt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {alt.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-1.5 whitespace-nowrap">
                    {alt.status === 'NEW' ? (
                      <>
                        <button
                          onClick={() => handleOfficerAction(alt.id, 'INVESTIGATE')}
                          className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-350 px-2.5 py-1 rounded text-[11px] font-extrabold shadow-sm"
                        >
                          Investigate
                        </button>
                        <button
                          onClick={() => handleOfficerAction(alt.id, 'DISMISS')}
                          className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-bold shadow-sm"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic font-semibold">
                        Action: {alt.status} by {alt.reviewedBy || 'Officer'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Satellite Computer Vision Change Detection Panel */}
      {changeDetection && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-xs font-semibold">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-755" />
              <span>Satellite Change Detection & Land-Use Change Analysis</span>
            </h3>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-extrabold">
              Confidence: {(changeDetection.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-medium shadow-sm">
              <div className="font-bold text-amber-700 text-sm">Detected Change Indicator</div>
              <p className="text-slate-800">
                ULPIN: <strong className="text-slate-900">{changeDetection.affectedParcel}</strong> | Affected Footprint: <strong className="text-emerald-700">{changeDetection.affectedAreaHectares} Ha</strong>
              </p>
              <div className="space-y-1 text-slate-500 pt-1 font-semibold">
                {changeDetection.evidence.map((e: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 flex flex-col justify-between shadow-sm font-medium">
              <div>
                <div className="font-bold text-slate-900 text-sm">AI Recommendation & Officer Action</div>
                <p className="text-slate-700 mt-1">{changeDetection.recommendation}</p>
                <p className="text-[10px] text-slate-500 italic mt-2">{changeDetection.disclaimer}</p>
              </div>
              <button
                onClick={() => handleOfficerAction('ALT_AI_001', 'INVESTIGATE')}
                className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-colors self-start mt-2 shadow-sm"
              >
                Order Field Inspection Survey
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
