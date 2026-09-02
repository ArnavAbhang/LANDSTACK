# LAND STACK — Phase 9 Satellite Imagery Tile Architecture & Change Detection Linkage

## 1. Raster / Vector Separation
MapLibre GL JS renders raster satellite imagery underneath vector cadastral boundary polygons:

```
  RASTER LAYER (ISRO Bhuvan / Orthophoto / XYZ Tiles)
                         ↓
  VECTOR LAYER (Irregular Cadastral Parcel Polygons)
                         ↓
  GOVERNANCE LAYER (Land Use / Master Plan / Restrictions)
```

## 2. Satellite Change Detection Pipeline
1. Previous vs Current Satellite Imagery Comparison.
2. Image alignment and spatial change polygon extraction.
3. PostGIS spatial intersection: `ST_Intersects(changedArea, parcelGeometry)`.
4. Identification of affected ULPIN anchors.
5. AI Risk Scoring (0–100) & Human Officer `FIELD_VERIFICATION` trigger.
