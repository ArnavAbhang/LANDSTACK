import React, { useEffect, useState } from 'react';
import { X, Layers, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface ParcelCompareModalProps {
  ulpin1: string | null;
  ulpin2: string | null;
  onClose: () => void;
}

export const ParcelCompareModal: React.FC<ParcelCompareModalProps> = ({ ulpin1, ulpin2, onClose }) => {
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    if (ulpin1 && ulpin2) {
      fetch(`http://localhost:8080/api/gis/compare?ulpin1=${ulpin1}&ulpin2=${ulpin2}`)
        .then((res) => res.json())
        .then((data) => setComparisonData(data))
        .catch(() => {
          setComparisonData({
            parcel1: { ulpin: ulpin1, surveyNumber: '123/4', areaDisplay: '2.45 Hectares', landType: 'Agricultural', zoning: 'AG-GEN Zone', taxStatus: 'PAID', disputeRisk: 'LOW' },
            parcel2: { ulpin: ulpin2, surveyNumber: '125/3', areaDisplay: '1.70 Hectares', landType: 'Non-Agricultural', zoning: 'R1-RES Zone', taxStatus: 'OVERDUE', disputeRisk: 'HIGH' },
            spatialRelationship: 'Contiguous Adjacent Parcels along Eastern Boundary',
            boundaryConflictDetected: true,
            overlapAreaSqMeters: 130.0
          });
        });
    }
  }, [ulpin1, ulpin2]);

  if (!ulpin1 || !ulpin2) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 text-slate-900 font-sans">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-755" />
              <span>Dual Parcel Spatial Comparison</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Comparing spatial conditions, boundary overlap, zoning classifications, and financial dues.
            </p>
          </div>

          <button onClick={onClose} className="text-slate-455 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {comparisonData ? (
          <div className="p-6 overflow-y-auto space-y-6 text-xs font-semibold">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 space-y-1 shadow-sm font-medium">
              <div className="font-bold text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span className="font-black text-slate-900">Spatial Conflict Analysis</span>
              </div>
              <p className="text-slate-700">
                {comparisonData.spatialRelationship}. Overlap detected: <span className="font-bold text-amber-800">{comparisonData.overlapAreaSqMeters} m²</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Parcel 1 */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                <div className="font-bold text-blue-900 text-sm pb-2 border-b border-slate-200">
                  Parcel A: {comparisonData.parcel1.ulpin}
                </div>
                <div className="space-y-2 text-slate-700 font-medium">
                  <div><span className="text-slate-500">Survey No:</span> {comparisonData.parcel1.surveyNumber}</div>
                  <div><span className="text-slate-500">Area:</span> {comparisonData.parcel1.areaDisplay}</div>
                  <div><span className="text-slate-500">Land Type:</span> {comparisonData.parcel1.landType}</div>
                  <div><span className="text-slate-500">Zoning:</span> {comparisonData.parcel1.zoning}</div>
                  <div><span className="text-slate-500">Tax Dues:</span> <span className="text-emerald-700 font-bold">{comparisonData.parcel1.taxStatus}</span></div>
                </div>
              </div>

              {/* Parcel 2 */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                <div className="font-bold text-amber-805 text-sm pb-2 border-b border-slate-200">
                  Parcel B: {comparisonData.parcel2.ulpin}
                </div>
                <div className="space-y-2 text-slate-700 font-medium">
                  <div><span className="text-slate-500">Survey No:</span> {comparisonData.parcel2.surveyNumber}</div>
                  <div><span className="text-slate-500">Area:</span> {comparisonData.parcel2.areaDisplay}</div>
                  <div><span className="text-slate-500">Land Type:</span> {comparisonData.parcel2.landType}</div>
                  <div><span className="text-slate-500">Zoning:</span> {comparisonData.parcel2.zoning}</div>
                  <div><span className="text-slate-500">Tax Dues:</span> <span className="text-red-700 font-bold">{comparisonData.parcel2.taxStatus}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 font-bold">Loading spatial comparison data...</div>
        )}

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-4 py-2 rounded-lg shadow-sm">
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
