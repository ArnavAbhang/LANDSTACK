# LAND STACK — Phase 11 Database & GIS Scalability Architecture

## 1. PostGIS GiST Spatial Indexing
Accelerates spatial queries (`ST_Intersects`, `ST_BBox`) via `idx_parcels_geometry_gist`, enabling fast viewport map loading without simplifying complex irregular cadastral boundary shapes.

## 2. Paginated APIs & Viewport Bounding Box Loading
- `/api/parcels?page=0&size=10&bbox=73.84,18.52,73.87,18.55`: Returns only visible parcels in current viewport.
- `/api/gis/tiles/{z}/{x}/{y}.pbf`: Vector Tile (MVT) PBF endpoint for state-scale rendering.
