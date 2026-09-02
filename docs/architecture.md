# LAND STACK System Architecture Specification

## 1. Overview
Land Stack (SIH26014) is an integrated GIS-based Digital Public Infrastructure (DPI) platform designed for the Ministry of Rural Development, Department of Land Resources (DoLR).

## 2. Core Architectural Pillars

### 2.1 State Adapter & Data Normalization
- Land administration is a state subject in India.
- Source records from Maharashtra (7/12, 8A), Tamil Nadu (Patta, Chitta, Adangal), and Punjab (Jamabandi, Fard) have dissimilar structures, fields, and terminology.
- The **State Adapter** layer decouples source formatting from the business logic by validating, mapping, and normalizing raw JSON/XML documents into the canonical `LandStackParcel` data model.

### 2.2 Parcel-Centric Data Aggregation
- Every record in the system—Record of Rights (RoR), Property Registration, Tax Assessments, Water/Electricity Utilities, Encumbrances, Zoning Classifications, and Legal Disputes—is mapped to a single unified spatial object identified by **ULPIN** (Unique Land Parcel Identification Number) or a state-specific parcel key.

### 2.3 Locality-First Spatial GIS Architecture
- To optimize performance and prevent fetching nationwide datasets at once, the frontend enforces a mandatory locality cascade:
  `State → District → Sub-District/Taluka → Village/Locality`
- Upon selecting a village, spatial PostGIS queries return vector boundaries formatted as standard GeoJSON for MapLibre GL JS rendering.

### 2.4 Multi-Tier Governance & RBAC Matrix
- Three visibility levels:
  - **Public**: ULPIN, parcel outline, land type, land use, anonymized area.
  - **Authenticated Owner**: Full RoR details, ownership chain, tax/utility bills, private documents, mutation history.
  - **Authorized Government**: Department-scoped access (Revenue, Registration, Planning, Tax, Utility, Admin) with complete audit logs and approval capabilities.

---

## 3. Technology Stack Topology

```
                       ┌────────────────────────────────┐
                       │     React + TypeScript UI      │
                       │ (Vite, Tailwind, MapLibre GL)  │
                       └───────────────┬────────────────┘
                                       │
                       ┌───────────────┴────────────────┐
                       │   Spring Boot API Gateway      │
                       │   (JWT, Security, JPA, REST)   │
                       └───────┬────────────────┬───────┘
                               │                │
           ┌───────────────────┴──┐          ┌──┴───────────────────┐
           ▼                      ▼          ▼                      ▼
  PostgreSQL / PostGIS          MinIO    Python FastAPI AI    State Adapters
  (Spatial Datasets & RDBMS)   (Files)  (Risk & Decision)   (MH, TN Data Normalizer)
```
