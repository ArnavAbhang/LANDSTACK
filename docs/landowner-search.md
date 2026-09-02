# LAND STACK — Government Land & Owner Search Specification

## 1. Search Portal Overview
The **Land & Owner Search** portal (`LandOwnerSearch.tsx`) provides authorized government revenue officers with multi-parameter search capabilities:
- **Search Modes**: `ULPIN`, `Person ID`, `Owner Name`, `Survey Number`, `State Parcel ID`, `Case ID`, `Service Request ID`.
- **Jurisdiction Scoping**: Enforces JBAC filtering by `State`, `District`, `Taluka`, and `Village`.

## 2. Owner Dossier & GIS Integration
Selecting a candidate Person ID opens the **Owner Dossier** (`OwnerDossier.tsx`), presenting authorized property listings and the **"View All Authorized Parcels on GIS"** action, which triggers MapLibre parcel highlighting across the map viewport.
