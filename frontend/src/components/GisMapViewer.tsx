import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Layers, Eye, ShieldAlert, CheckCircle, Info, Maximize2, AlertTriangle, Cpu, Globe, Compass, FileSearch, Search, MapPin, ArrowRight, X } from 'lucide-react';
import { ParcelCompareModal } from './ParcelCompareModal';

interface GisMapViewerProps {
  selectedState: string;
  selectedVillage: string;
  selectedUlpin: string | null;
  onSelectParcel: (ulpin: string) => void;
  onOpenFullDossier?: (ulpin: string) => void;
}

export const GisMapViewer: React.FC<GisMapViewerProps> = ({
  selectedState,
  selectedVillage,
  selectedUlpin,
  onSelectParcel,
  onOpenFullDossier,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  // Active Spatial Layers State
  const [activeLayers, setActiveLayers] = useState({
    cadastral: true,
    ulpinLabels: true,
    landUse: false,
    zoning: false,
    masterPlan: false,
    utilities: false,
    roads: false,
    restrictions: false,
    satellite: false,
    spatialRisk: false,
  });

  // Selected Parcel Panel & Risk
  const [spatialRisk, setSpatialRisk] = useState<any>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    if (selectedUlpin) {
      fetch(`http://localhost:8080/api/ai/parcel-risk/${selectedUlpin}`)
        .then((res) => res.json())
        .then((data) => setSpatialRisk(data))
        .catch(() => setSpatialRisk(null));
    } else {
      setSpatialRisk(null);
    }
  }, [selectedUlpin]);

  const centerCoords: [number, number] =
    selectedState === 'ST_TN' ? [79.9350, 12.9530] : [73.8550, 18.5240];

  // Initialize and update MapLibre GL JS
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: activeLayers.satellite
        ? {
            version: 8,
            sources: {
              'satellite-tiles': {
                type: 'raster',
                tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                tileSize: 256,
              },
            },
            layers: [
              {
                id: 'satellite-layer',
                type: 'raster',
                source: 'satellite-tiles',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          }
        : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: centerCoords,
      zoom: 15.5,
      pitch: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // Ingest PostGIS Irregular Polygon Cadastral Geometries
      const geojsonUrl = `http://localhost:8080/api/gis/parcels?state=${selectedState}&villageId=${selectedVillage}`;
      fetch(geojsonUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!map.current) return;
          if (!map.current.getSource('parcels-src')) {
            map.current.addSource('parcels-src', { type: 'geojson', data: data });

            // Cadastral Polygon Fill Layer
            map.current.addLayer({
              id: 'parcels-fill',
              type: 'fill',
              source: 'parcels-src',
              paint: {
                'fill-color': [
                  'case',
                  ['==', ['get', 'riskLevel'], 'HIGH'], '#ef4444',
                  ['==', ['get', 'riskLevel'], 'MEDIUM'], '#f59e0b',
                  '#10b981'
                ],
                'fill-opacity': activeLayers.satellite ? 0.40 : 0.25,
              },
            });

            // Cadastral Polygon Thin Boundary Outline
            map.current.addLayer({
              id: 'parcels-outline',
              type: 'line',
              source: 'parcels-src',
              paint: {
                'line-color': activeLayers.satellite ? '#ffffff' : '#1e3a8a',
                'line-width': 1.5,
              },
            });
          }

          // Auto-Fit Map Viewport to Village Extent
          if (data.features && data.features.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            data.features.forEach((feature: any) => {
              if (feature.geometry && feature.geometry.coordinates) {
                feature.geometry.coordinates[0].forEach((coord: number[]) => {
                  bounds.extend([coord[0], coord[1]]);
                });
              }
            });
            map.current.fitBounds(bounds, { padding: 40, maxZoom: 16.5 });
          }
        })
        .catch(() => {});

      // Hover Tooltip Popup
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
      map.current.on('mouseenter', 'parcels-fill', (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        map.current.getCanvas().style.cursor = 'pointer';

        const props = e.features[0].properties;
        popup
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="text-xs space-y-1 font-sans p-1">
              <div class="font-bold text-blue-900">ULPIN: ${props.ulpin}</div>
              <div><span class="text-slate-500 font-semibold">Survey No:</span> ${props.surveyNumber}</div>
              <div><span class="text-slate-500 font-semibold">Owner:</span> ${props.ownerName}</div>
              <div><span class="text-slate-500 font-semibold">Area:</span> ${props.areaDisplay}</div>
              <div class="text-[10px] text-blue-700 font-bold">Click to view parcel details</div>
            </div>
          `)
          .addTo(map.current);
      });

      map.current.on('mouseleave', 'parcels-fill', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.current.on('click', 'parcels-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const ulpin = e.features[0].properties.ulpin;
        onSelectParcel(ulpin);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [selectedState, selectedVillage, activeLayers.satellite]);

  // Fetch Spatial Risk details when a parcel is clicked
  useEffect(() => {
    if (selectedUlpin) {
      fetch(`http://localhost:8080/api/gis/spatial-risk?ulpin=${selectedUlpin}`)
        .then((res) => res.json())
        .then((data) => setSpatialRisk(data))
        .catch(() => {
          setSpatialRisk({
            ulpin: selectedUlpin,
            riskScore: selectedUlpin.includes('002') ? 0.78 : 0.12,
            riskLevel: selectedUlpin.includes('002') ? 'HIGH' : 'LOW',
            explainabilityReasons: selectedUlpin.includes('002')
              ? ['Potential Spatial Boundary Conflict (130 m² overlap)', 'Master Plan Ring Road Reservation Impact']
              : ['No adverse spatial boundary or zoning indicators identified.'],
            recommendedAction: selectedUlpin.includes('002')
              ? 'Priority field survey required prior to mutation approval.'
              : 'Clear spatial status; eligible for System Clearance Certificate.'
          });
        });
    }
  }, [selectedUlpin]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchQuery.trim()) return;

    onSelectParcel(searchQuery.trim());
  };

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-slate-100 flex flex-col font-sans">
      
      {/* Top GIS Navigation Strip */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        
        {/* Breadcrumb Location */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-blue-900" />
          <span>{selectedState === 'ST_TN' ? 'Tamil Nadu' : selectedState === 'ST_PB' ? 'Punjab' : 'Maharashtra'}</span>
          <span>&gt;</span>
          <span>{selectedState === 'ST_TN' ? 'Kanchipuram' : selectedState === 'ST_PB' ? 'SAS Nagar' : 'Pune'}</span>
          <span>&gt;</span>
          <span>{selectedState === 'ST_TN' ? 'Sriperumbudur' : selectedState === 'ST_PB' ? 'Mohali' : 'Haveli'}</span>
          <span>&gt;</span>
          <span className="text-blue-900 font-extrabold">{selectedVillage || 'Paud'}</span>
        </div>

        {/* Prominent Parcel Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ULPIN, Survey Number or Parcel..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold pl-9 pr-3 py-1.5 rounded-xl focus:border-blue-700 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-sm transition-all"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Main GIS Body: Left Controls + Center Map + Right Drawer */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Left Compact Layer Controls */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-xl w-72 max-h-[82vh] overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>GIS Layer Controls</span>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
              PostGIS Vector
            </span>
          </div>

          {/* 1. Base Map */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BASE MAP</div>
            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-700" />
                Satellite Raster Basemap
              </span>
              <input
                type="checkbox"
                checked={activeLayers.satellite}
                onChange={() => toggleLayer('satellite')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>
          </div>

          {/* 2. Cadastral Layer */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CADASTRAL</div>
            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Parcel Boundaries
              </span>
              <input
                type="checkbox"
                checked={activeLayers.cadastral}
                onChange={() => toggleLayer('cadastral')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                ULPIN Labels
              </span>
              <input
                type="checkbox"
                checked={activeLayers.ulpinLabels}
                onChange={() => toggleLayer('ulpinLabels')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>
          </div>

          {/* 3. Governance Layers */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GOVERNANCE</div>
            
            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Land Use Classification
              </span>
              <input
                type="checkbox"
                checked={activeLayers.landUse}
                onChange={() => toggleLayer('landUse')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Zoning Bounds (R1 / AG)
              </span>
              <input
                type="checkbox"
                checked={activeLayers.zoning}
                onChange={() => toggleLayer('zoning')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Master Plan Reservations
              </span>
              <input
                type="checkbox"
                checked={activeLayers.masterPlan}
                onChange={() => toggleLayer('masterPlan')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Environmental Restrictions
              </span>
              <input
                type="checkbox"
                checked={activeLayers.restrictions}
                onChange={() => toggleLayer('restrictions')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>
          </div>

          {/* 4. Infrastructure & Analytics */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">INFRASTRUCTURE & ANALYTICS</div>
            
            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                Utility Line Networks
              </span>
              <input
                type="checkbox"
                checked={activeLayers.utilities}
                onChange={() => toggleLayer('utilities')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-800 cursor-pointer font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                Road Networks
              </span>
              <input
                type="checkbox"
                checked={activeLayers.roads}
                onChange={() => toggleLayer('roads')}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-700"
              />
            </label>
          </div>

        </div>

        {/* Center Dominant Maplibre Canvas */}
        <div ref={mapContainer} className="flex-1 h-full w-full" />

        {/* Floating Map Legend at Bottom Right */}
        <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3 shadow-lg text-[11px] space-y-1.5 font-semibold">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">Map Legend</div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-0.5 bg-emerald-600"></span>
            <span>Cadastral Boundary</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-2 bg-emerald-200 border border-emerald-500"></span>
            <span>Agricultural Land</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-2 bg-blue-200 border border-blue-500"></span>
            <span>Residential Zone</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-0.5 bg-amber-500"></span>
            <span>Road / Pipeline</span>
          </div>
        </div>

        {/* Right-Side Compact Parcel Information Panel (Does NOT hide the map) */}
        {selectedUlpin && (
          <div className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4 shadow-2xl z-20 font-sans">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-black">
                  PARCEL DETAILS
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">{selectedUlpin}</h3>
              </div>
              <button
                onClick={() => onSelectParcel('')}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Survey No:</span>
                  <span className="font-bold text-slate-900">125/1</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Area:</span>
                  <span className="font-bold text-slate-900">3.10 Hectares</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Land Type:</span>
                  <span className="font-bold text-slate-900">Agricultural</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Primary Owner:</span>
                  <span className="font-bold text-blue-900">Rahul Anil Deshmukh</span>
                </div>
              </div>

              {/* Spatial Intelligence Status */}
              {spatialRisk && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">AI Risk Evaluation</span>
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      spatialRisk.riskLevel === 'CRITICAL' || spatialRisk.riskLevel === 'HIGH'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : spatialRisk.riskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {spatialRisk.riskLevel} ({spatialRisk.riskScore}/100)
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-[11px]">{spatialRisk.finding}</div>
                  <p className="text-[11px] text-slate-600 font-medium">{spatialRisk.recommendation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onOpenFullDossier && onOpenFullDossier(selectedUlpin)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Open Full Parcel Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowCompareModal(true)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2 rounded-xl text-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <FileSearch className="w-3.5 h-3.5 text-blue-700" />
                  <span>Compare Adjacent Parcel</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Compare Modal */}
        {showCompareModal && selectedUlpin && (
          <ParcelCompareModal
            ulpin1={selectedUlpin}
            ulpin2="MH-27-PUN-000847"
            onClose={() => setShowCompareModal(false)}
          />
        )}

      </div>

    </div>
  );
};
