import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Globe, MapPin, Search, ArrowRight, X, Sparkles, FileSearch, Loader2, Info, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ParcelCompareModal } from './ParcelCompareModal';
import { getSavedSession } from '../utils/session';

interface GisMapViewerProps {
  selectedState: string;
  selectedVillage: string;
  selectedUlpin: string | null;
  onSelectParcel: (ulpin: string) => void;
  onOpenFullDossier?: (ulpin: string) => void;
}

const OSM_MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export const GisMapViewer: React.FC<GisMapViewerProps> = ({
  selectedState,
  selectedVillage,
  selectedUlpin,
  onSelectParcel,
  onOpenFullDossier,
}) => {
  const session = getSavedSession();
  const isGov = session?.user?.role === 'GOVERNMENT' || session?.user?.portal === 'GOVERNMENT' || session?.user?.role === 'ADMIN';

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  // GIS panel collapsed state
  const [gisCollapsed, setGisCollapsed] = useState(false);

  // Active Spatial Layers State
  const [activeLayers, setActiveLayers] = useState({
    satellite: false,
    cadastral: true,
    ulpinLabels: true,
    landUse: false,
    zoning: false,
    masterPlan: false,
    restrictions: false,
    utilities: false,
    roads: false,
  });

  // Layer metadata & loading indicators
  const [layerLoading, setLayerLoading] = useState<Record<string, boolean>>({});
  const [layerMetadata, setLayerMetadata] = useState<Record<string, { hasData: boolean; featureCount: number; notice?: string }>>({});

  // Selected Parcel Dynamic State & Risk
  const [selectedParcelData, setSelectedParcelData] = useState<any>(null);
  const [parcelLoading, setParcelLoading] = useState<boolean>(false);
  const [spatialRisk, setSpatialRisk] = useState<any>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const centerCoords: [number, number] =
    selectedState === 'ST_TN' ? [79.9350, 12.9530] : (selectedState === 'ST_PB' ? [75.7600, 31.8400] : [73.8550, 18.5240]);

  // Fetch Spatial Risk & Parcel details when selectedUlpin changes
  useEffect(() => {
    if (selectedUlpin) {
      setParcelLoading(true);
      setSelectedParcelData(null);
      setSpatialRisk(null);

      const token = localStorage.getItem('landstack_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Dynamic Parcel Detail API Fetch
      fetch(`http://localhost:8080/api/parcels/${selectedUlpin}`, { headers })
        .then((res) => {
          if (!res.ok) {
            // Fallback to public summary endpoint if non-owner or restricted
            return fetch(`http://localhost:8080/api/parcels/${selectedUlpin}/summary`, { headers })
              .then((sumRes) => (sumRes.ok ? sumRes.json() : null));
          }
          return res.json();
        })
        .then((data) => {
          if (data && !data.error) {
            setSelectedParcelData(data);
          } else {
            setSelectedParcelData(data || { error: `Parcel Information Unavailable: No record found for ULPIN ${selectedUlpin}` });
          }
          setParcelLoading(false);
        })
        .catch(() => {
          setSelectedParcelData({ error: `Parcel Information Unavailable: No record found for ULPIN ${selectedUlpin}` });
          setParcelLoading(false);
        });

      // Spatial Risk API Fetch
      fetch(`http://localhost:8080/api/gis/spatial-risk?ulpin=${selectedUlpin}`)
        .then((res) => res.json())
        .then((data) => setSpatialRisk(data))
        .catch(() => setSpatialRisk(null));
    } else {
      setSelectedParcelData(null);
      setSpatialRisk(null);
      setParcelLoading(false);
    }
  }, [selectedUlpin]);

  // Update Highlight Layer when selectedUlpin changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (map.current.getLayer('selected-parcel-highlight')) {
      map.current.setFilter('selected-parcel-highlight', ['==', ['get', 'ulpin'], selectedUlpin || '']);
    }
  }, [selectedUlpin, mapLoaded]);

  // Reset layer metadata & clear selection when jurisdiction changes
  useEffect(() => {
    setLayerMetadata({});
    onSelectParcel('');
  }, [selectedState, selectedVillage]);

  // Initialize MapLibre GL JS Map instance
  useEffect(() => {
    if (!mapContainer.current) return;
    setMapLoaded(false);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_MAP_STYLE,
      center: centerCoords,
      zoom: 15.5,
      pitch: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // 1. Add Satellite Raster Source & Layer
      map.current.addSource('satellite-src', {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
      });

      map.current.addLayer({
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite-src',
        layout: { visibility: 'none' },
        minzoom: 0,
        maxzoom: 19,
      });

      // Load Authoritative Cadastral Parcel Geometries from PostGIS API
      const geojsonUrl = `http://localhost:8080/api/gis/parcels?state=${selectedState}&villageId=${selectedVillage}`;
      fetch(geojsonUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!map.current) return;

          map.current.addSource('parcels-src', { type: 'geojson', data });

          // Cadastral Polygon Fill Layer
          map.current.addLayer({
            id: 'parcels-fill',
            type: 'fill',
            source: 'parcels-src',
            layout: { visibility: activeLayers.cadastral ? 'visible' : 'none' },
            paint: {
              'fill-color': [
                'case',
                ['==', ['get', 'disputeRisk'], 'HIGH'], '#ef4444',
                ['==', ['get', 'disputeRisk'], 'MEDIUM'], '#f59e0b',
                '#10b981'
              ],
              'fill-opacity': 0.38,
            },
          });

          // Cadastral Polygon Outline Layer
          map.current.addLayer({
            id: 'parcels-outline',
            type: 'line',
            source: 'parcels-src',
            layout: { visibility: activeLayers.cadastral ? 'visible' : 'none' },
            paint: {
              'line-color': '#1e3a8a',
              'line-width': 2.0,
            },
          });

          // ULPIN & Survey Number Dynamic Zoom-Dependent Labels Layer
          map.current.addLayer({
            id: 'ulpin-labels',
            type: 'symbol',
            source: 'parcels-src',
            layout: {
              'text-field': [
                'step',
                ['zoom'],
                '',
                14.5, ['concat', 'Plot #', ['get', 'surveyNumber']],
                15.5, ['concat', ['get', 'surveyNumber'], '\n', ['get', 'ulpin']]
              ],
              'text-size': 11,
              'text-anchor': 'center',
              'text-allow-overlap': false,
              'text-ignore-placement': false,
              'visibility': activeLayers.ulpinLabels ? 'visible' : 'none',
            },
            paint: {
              'text-color': '#0f172a',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2.5,
            },
          });

          // Selected Parcel Highlight Layer
          map.current.addLayer({
            id: 'selected-parcel-highlight',
            type: 'line',
            source: 'parcels-src',
            filter: ['==', ['get', 'ulpin'], selectedUlpin || ''],
            paint: {
              'line-color': '#f59e0b',
              'line-width': 4.5,
            },
          });

          // Auto-Fit Map Viewport to Cadastral Boundary Extent
          if (data.features && data.features.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            data.features.forEach((feature: any) => {
              if (feature.geometry && feature.geometry.coordinates) {
                feature.geometry.coordinates[0].forEach((coord: number[]) => {
                  bounds.extend([coord[0], coord[1]]);
                });
              }
            });
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 16.5 });
          }

          setMapLoaded(true);
        })
        .catch(() => setMapLoaded(true));

      // Setup Hover Tooltip & Click Handlers
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
              <div><span class="text-slate-500 font-semibold">Survey No:</span> ${props.surveyNumber || props.surveyNo}</div>
              <div><span class="text-slate-500 font-semibold">Owner:</span> ${props.ownerName}</div>
              <div><span class="text-slate-500 font-semibold">Area:</span> ${props.areaDisplay}</div>
              <div class="text-[10px] text-blue-700 font-bold">Click to select parcel</div>
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
        const props = e.features[0].properties;
        const ulpin = props.ulpin;
        if (ulpin) {
          onSelectParcel(ulpin);
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [selectedState, selectedVillage]);

  // Layer Toggle Handlers
  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    const updatedVisibility = !activeLayers[layerKey];
    setActiveLayers((prev) => ({ ...prev, [layerKey]: updatedVisibility }));

    if (!map.current || !mapLoaded) return;

    if (layerKey === 'satellite') {
      if (map.current.getLayer('satellite-layer')) {
        map.current.setLayoutProperty('satellite-layer', 'visibility', updatedVisibility ? 'visible' : 'none');
      }
    } else if (layerKey === 'cadastral') {
      if (map.current.getLayer('parcels-fill')) {
        map.current.setLayoutProperty('parcels-fill', 'visibility', updatedVisibility ? 'visible' : 'none');
      }
      if (map.current.getLayer('parcels-outline')) {
        map.current.setLayoutProperty('parcels-outline', 'visibility', updatedVisibility ? 'visible' : 'none');
      }
    } else if (layerKey === 'ulpinLabels') {
      if (map.current.getLayer('ulpin-labels')) {
        map.current.setLayoutProperty('ulpin-labels', 'visibility', updatedVisibility ? 'visible' : 'none');
      }
    } else {
      const layerId = `spatial-${layerKey}`;
      const fillLayerId = `${layerId}-fill`;
      const lineLayerId = `${layerId}-line`;

      if (updatedVisibility) {
        if (!map.current.getSource(layerId)) {
          setLayerLoading((prev) => ({ ...prev, [layerKey]: true }));
          fetch(`http://localhost:8080/api/gis/layers/${layerKey}?state=${selectedState}&villageId=${selectedVillage}`)
            .then((res) => res.json())
            .then((data) => {
              if (!map.current) return;
              map.current.addSource(layerId, { type: 'geojson', data });

              const hasLines = data.features && data.features.some((f: any) => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'));
              const hasPolygons = data.features && data.features.some((f: any) => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'));

              // 1. Add Polygon Fill Layer if polygons exist
              if (hasPolygons || (data.layerType !== 'line' && layerKey !== 'roads' && layerKey !== 'utilities')) {
                map.current.addLayer({
                  id: fillLayerId,
                  type: 'fill',
                  source: layerId,
                  filter: ['in', '$type', 'Polygon'],
                  paint: {
                    'fill-color': ['coalesce', ['get', 'color'], layerKey === 'restrictions' ? '#ef4444' : layerKey === 'zoning' ? '#f59e0b' : '#3b82f6'],
                    'fill-opacity': layerKey === 'restrictions' ? 0.45 : layerKey === 'landUse' ? 0.40 : 0.35,
                  },
                }, 'parcels-outline');

                // Polygon outline
                map.current.addLayer({
                  id: `${fillLayerId}-outline`,
                  type: 'line',
                  source: layerId,
                  filter: ['in', '$type', 'Polygon'],
                  paint: {
                    'line-color': ['coalesce', ['get', 'color'], '#1e293b'],
                    'line-width': 1.5,
                  },
                }, 'selected-parcel-highlight');
              }

              // 2. Add Line Layer if lines exist
              if (hasLines || layerKey === 'roads' || layerKey === 'utilities' || layerKey === 'masterPlan') {
                // Line Casing (Outline shadow)
                map.current.addLayer({
                  id: `${lineLayerId}-casing`,
                  type: 'line',
                  source: layerId,
                  filter: ['in', '$type', 'LineString'],
                  paint: {
                    'line-color': '#0f172a',
                    'line-width': layerKey === 'roads' ? 5.5 : 4.5,
                    'line-opacity': 0.8,
                  },
                }, 'selected-parcel-highlight');

                // Core Line
                map.current.addLayer({
                  id: lineLayerId,
                  type: 'line',
                  source: layerId,
                  filter: ['in', '$type', 'LineString'],
                  paint: {
                    'line-color': ['coalesce', ['get', 'color'], layerKey === 'roads' ? '#f87171' : layerKey === 'utilities' ? '#06b6d4' : '#db2777'],
                    'line-width': layerKey === 'roads' ? 3.8 : 2.8,
                    'line-dasharray': layerKey === 'utilities' ? [3, 1.5] : layerKey === 'masterPlan' ? [4, 2] : [1],
                  },
                }, 'selected-parcel-highlight');
              }

              // Interactive Hover Tooltips for this layer
              const spatialPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
              const interactiveLayerIds = [fillLayerId, lineLayerId].filter(id => map.current?.getLayer(id));

              interactiveLayerIds.forEach((targetLId) => {
                map.current?.on('mouseenter', targetLId, (e) => {
                  if (!map.current || !e.features || !e.features[0]) return;
                  map.current.getCanvas().style.cursor = 'pointer';
                  const props = e.features[0].properties;
                  spatialPopup
                    .setLngLat(e.lngLat)
                    .setHTML(`
                      <div class="text-xs space-y-1 font-sans p-1">
                        <div class="font-extrabold text-blue-900">${props.name || 'GIS Feature'}</div>
                        <div class="text-[11px] text-slate-600 font-semibold"><span class="text-slate-400">Type:</span> ${props.category || 'Spatial Feature'}</div>
                        <div class="text-[10px] text-slate-500 font-medium">Layer: <strong class="uppercase text-slate-800">${layerKey}</strong></div>
                      </div>
                    `)
                    .addTo(map.current);
                });

                map.current?.on('mouseleave', targetLId, () => {
                  if (!map.current) return;
                  map.current.getCanvas().style.cursor = '';
                  spatialPopup.remove();
                });
              });

              const count = data.features ? data.features.length : 0;
              setLayerMetadata((prev) => ({
                ...prev,
                [layerKey]: { hasData: count > 0, featureCount: count, notice: data.dataNotice },
              }));
              setLayerLoading((prev) => ({ ...prev, [layerKey]: false }));
            })
            .catch(() => {
              setLayerLoading((prev) => ({ ...prev, [layerKey]: false }));
            });
        } else {
          if (map.current.getLayer(fillLayerId)) map.current.setLayoutProperty(fillLayerId, 'visibility', 'visible');
          if (map.current.getLayer(`${fillLayerId}-outline`)) map.current.setLayoutProperty(`${fillLayerId}-outline`, 'visibility', 'visible');
          if (map.current.getLayer(lineLayerId)) map.current.setLayoutProperty(lineLayerId, 'visibility', 'visible');
          if (map.current.getLayer(`${lineLayerId}-casing`)) map.current.setLayoutProperty(`${lineLayerId}-casing`, 'visibility', 'visible');
        }
      } else {
        if (map.current.getLayer(fillLayerId)) map.current.setLayoutProperty(fillLayerId, 'visibility', 'none');
        if (map.current.getLayer(`${fillLayerId}-outline`)) map.current.setLayoutProperty(`${fillLayerId}-outline`, 'visibility', 'none');
        if (map.current.getLayer(lineLayerId)) map.current.setLayoutProperty(lineLayerId, 'visibility', 'none');
        if (map.current.getLayer(`${lineLayerId}-casing`)) map.current.setLayoutProperty(`${lineLayerId}-casing`, 'visibility', 'none');
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchQuery.trim()) return;
    onSelectParcel(searchQuery.trim());
  };

  const stateNameDisplay = selectedState === 'ST_TN' ? 'Tamil Nadu' : (selectedState === 'ST_PB' ? 'Punjab' : 'Maharashtra');

  return (
    <div className="absolute inset-0 font-sans text-slate-900 bg-slate-100 flex flex-col overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Search Toolbar — top-left, max-width capped so it never reaches the GIS panel */}
      <div className="absolute top-4 left-4 z-30 font-medium" style={{ maxWidth: 'calc(100% - 360px - 2rem)', width: '22rem' }}>
        <form onSubmit={handleSearchSubmit} className="relative shadow-xl rounded-2xl">
          <input
            type="text"
            placeholder="Search ULPIN (e.g., MH-27-PUN-000003)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-semibold pl-10 pr-10 py-3 rounded-2xl focus:outline-none focus:border-blue-900 shadow-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white p-1.5 rounded-xl transition-all shadow-sm"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
        {searchError && (
          <div className="mt-1 text-[11px] text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl shadow-sm">
            {searchError}
          </div>
        )}
      </div>

      {/* GIS Layer Controls Sidebar Drawer — top-right, collapsible */}
      <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur-md border border-slate-200 w-72 rounded-2xl shadow-xl overflow-hidden font-sans text-xs">
        <button
          onClick={() => setGisCollapsed((v) => !v)}
          className="w-full bg-slate-900 text-white px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors"
          title={gisCollapsed ? 'Expand GIS Layers' : 'Collapse GIS Layers'}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <div className="text-left">
              <span className="font-extrabold text-xs block">GIS Data Layers</span>
              <span className="text-[9px] text-slate-400 font-medium">Spatial layers powered by PostGIS</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">
              {gisCollapsed ? '▶' : '▼'}
            </span>
          </div>
        </button>

        {!gisCollapsed && <div className="p-3 space-y-3.5 max-h-[65vh] overflow-y-auto font-medium">
          {/* 1. BASE IMAGERY */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Imagery</div>
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
              <span className="font-bold text-slate-800">Satellite Imagery</span>
              <input
                type="checkbox"
                checked={activeLayers.satellite}
                onChange={() => toggleLayer('satellite')}
                className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
              />
            </label>
          </div>

          {/* 2. CADASTRAL PARCELS */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cadastral Parcels</div>
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
              <span className="font-bold text-slate-800">Parcel Boundaries</span>
              <input
                type="checkbox"
                checked={activeLayers.cadastral}
                onChange={() => toggleLayer('cadastral')}
                className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
              <span className="font-bold text-slate-800">ULPIN Labels</span>
              <input
                type="checkbox"
                checked={activeLayers.ulpinLabels}
                onChange={() => toggleLayer('ulpinLabels')}
                className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
              />
            </label>
          </div>

          {/* 3. SPATIAL PLANNING */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spatial Planning</div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-800">Land Use Classification</span>
                    {layerLoading.landUse && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">Irrigated, Residential & Commercial</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.landUse}
                  onChange={() => toggleLayer('landUse')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.landUse && layerMetadata.landUse && (
                <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ 36 Cadastral Plot Uses Active</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">Zoning Bounds</span>
                    {layerLoading.zoning && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">R-1, R-2, C-1, C-2, AG Green Belt</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.zoning}
                  onChange={() => toggleLayer('zoning')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.zoning && layerMetadata.zoning && (
                <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ 6 PMRDA Statutory Zones</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                    <span className="font-bold text-slate-800">Master Plan Reservations</span>
                    {layerLoading.masterPlan && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">30m Ring Road, PHC, Park & School</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.masterPlan}
                  onChange={() => toggleLayer('masterPlan')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.masterPlan && layerMetadata.masterPlan && (
                <div className="text-[10px] text-pink-800 bg-pink-50 border border-pink-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ Ring Road Corridor & 3 Amenities</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="font-bold text-slate-800">Environmental Restrictions</span>
                    {layerLoading.restrictions && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">River Red Line Flood & ESZ Buffer</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.restrictions}
                  onChange={() => toggleLayer('restrictions')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.restrictions && layerMetadata.restrictions && (
                <div className="text-[10px] text-red-800 bg-red-50 border border-red-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ 3 Statutory Restriction Zones</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. INFRASTRUCTURE & ANALYTICS */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Infrastructure & Analytics</div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                    <span className="font-bold text-slate-800">Utility Line Networks</span>
                    {layerLoading.utilities && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">33kV Power, Water Main, Canal & OFC</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.utilities}
                  onChange={() => toggleLayer('utilities')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.utilities && layerMetadata.utilities && (
                <div className="text-[10px] text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ 5 Utility Network Trunks Across Plots</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="font-bold text-slate-800">Road Networks</span>
                    {layerLoading.roads && <Loader2 className="w-3 h-3 animate-spin text-blue-800" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block pl-4">NH-753F, Bypass, 3 Spines & Collectors</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers.roads}
                  onChange={() => toggleLayer('roads')}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800"
                />
              </label>
              {activeLayers.roads && layerMetadata.roads && (
                <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg flex items-center justify-between">
                  <span>✓ 7 Highway, Spine & Farm Access Roads</span>
                  <span className="font-mono font-bold">PostGIS</span>
                </div>
              )}
            </div>
          </div>
        </div>}
      </div>

      {/* Selected Parcel Side Drawer Card — bottom-left, same column as search */}
      {selectedUlpin && (
        <div className="absolute bottom-6 left-4 z-30 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-4 space-y-3 font-sans animate-in slide-in-from-bottom duration-200" style={{ width: '22rem', maxWidth: 'calc(100% - 2rem)' }}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-black">
                SELECTED PARCEL
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">{selectedUlpin}</h3>
            </div>
            <button onClick={() => onSelectParcel('')} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs font-medium">
            {parcelLoading ? (
              <div className="p-6 text-center text-slate-500 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                <span>Fetching parcel data for {selectedUlpin}...</span>
              </div>
            ) : selectedParcelData?.error ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1 text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Parcel Information Unavailable</span>
                </div>
                <p className="text-[11px] text-amber-800">{selectedParcelData.error}</p>
              </div>
            ) : (
              selectedParcelData && (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Survey No:</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedParcelData.surveyNo || selectedParcelData.surveyNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Cadastral Area:</span>
                    <span className="font-bold text-slate-900">{selectedParcelData.areaDisplay || selectedParcelData.areaHectare + ' Hectares'}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Land Classification:</span>
                    <span className="font-bold text-slate-900">{selectedParcelData.landType}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Primary Owner:</span>
                    <span className="font-extrabold text-blue-900">{selectedParcelData.ownerName}</span>
                  </div>
                </div>
              )
            )}

            {/* Spatial Intelligence Status */}
            {(spatialRisk || selectedParcelData) && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Risk Evaluation</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      (spatialRisk?.riskLevel === 'CRITICAL' || spatialRisk?.riskLevel === 'HIGH' || selectedParcelData?.disputeRisk === 'HIGH')
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : (spatialRisk?.riskLevel === 'MEDIUM' || selectedParcelData?.disputeRisk === 'MEDIUM')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isGov
                      ? `${spatialRisk?.riskLevel || selectedParcelData?.disputeRisk || 'LOW'} (${spatialRisk?.riskScore || (selectedParcelData?.disputeRisk === 'HIGH' ? 85 : selectedParcelData?.disputeRisk === 'MEDIUM' ? 55 : 12)}/100 | ${Math.round((spatialRisk?.confidence || 0.96) * 100)}% Confidence)`
                      : `${spatialRisk?.riskLevel || selectedParcelData?.disputeRisk || 'LOW'} RISK ${spatialRisk?.riskLevel === 'HIGH' || selectedParcelData?.disputeRisk === 'HIGH' ? 'ALERT' : spatialRisk?.riskLevel === 'MEDIUM' || selectedParcelData?.disputeRisk === 'MEDIUM' ? 'CAUTION' : 'CLEAR'}`}
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-[11px]">
                  {spatialRisk?.finding || (selectedParcelData?.disputeRisk === 'HIGH' ? 'Active Civil Injunction & Boundary Overlap Conflict' : 'Cadastral Boundary & Ownership Records Verified Clear')}
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {spatialRisk?.recommendation || (selectedParcelData?.disputeRisk === 'HIGH' ? 'Field verification survey ordered by Revenue Department.' : 'No active litigation or boundary discrepancies detected.')}
                </p>
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
  );
};
