# LAND STACK — Integrated GIS-Based Digital Public Infrastructure for Land Governance

**Project Code**: SIH26014  
**Organization**: Ministry of Rural Development — Department of Land Resources (DoLR)  
**Department**: Land Governance & Spatial Digital Public Infrastructure (DPI)  
**Theme**: Robotics, Drones & GIS Land Governance  

---

## 📌 Executive Summary

**Land Stack** is a unified, parcel-centric **Digital Public Infrastructure (DPI)** designed to transform fragmented Indian land governance into an interoperable, transparent, AI-assisted, and citizen-centric ecosystem.

In India, land administration is a state subject under Schedule VII of the Constitution. Consequently, each state operates independent revenue systems with divergent field names, record structures, administrative hierarchies, and document terminology:
- **Maharashtra**: 7/12 Extract (Saat Bara), 8A Khata, Ferfar (Mutation Entry).
- **Tamil Nadu**: Patta (Title Deed), Chitta (Ownership Register), Adangal (Crop/Land Use Register).
- **Punjab**: Jamabandi (RoR Fard), Intqal (Mutation), Khasra/Khewat Numbers.

Land Stack bridges these fragmented departmental and state-level silos through a **State-Adapter & Schema Normalization Engine**. It ingests state-specific source payloads, normalizes them into a canonical `LandStackRecord`, and anchors all attributes around a spatial **ULPIN** (Unique Land Parcel Identification Number) key with PostGIS polygon boundaries.

---

## 🌟 Core Working Principles

```
  STATE SOURCE RECORDS              STATE-SPECIFIC ADAPTERS           CANONICAL DSI MODEL
┌──────────────────────┐         ┌──────────────────────────┐      ┌───────────────────────┐
│ MH: 7/12 & 8A        │ ──────> │ MaharashtraAdapter       │ ───> │ ownerName             │
│ TN: Patta & Chitta   │ ──────> │ TamilNaduAdapter         │ ───> │ surveyNumber          │
│ PB: Jamabandi Fard   │ ──────> │ PunjabAdapter            │ ───> │ areaSquareMeters      │
└──────────────────────┘         └──────────────────────────┘      └───────────────────────┘
                                                                               │
                                                                               ▼
                                                                     PARCEL / ULPIN CORE
                                                                               │
       ┌──────────────────────┬──────────────────────┬─────────────────────────┼─────────────────────────┐
       ▼                      ▼                      ▼                         ▼                         ▼
  GIS MAP PORTAL       STATE ADAPTER HUB     GOVT DASHBOARDS           AI GOVERNANCE           CITIZEN PORTAL
(MapLibre + PostGIS)  (Schema Mapping)    (Interoperability)       (Explainable Risk)      (Service Requests)
```

1. **ULPIN as the Common Spatial Anchor**:
   Every land plot is assigned a 14-digit alphanumeric ULPIN (e.g. `MH-27-PUN-001-8472`). The ULPIN serves as the single source of truth connecting Revenue, Registration, Tax, Urban Planning, Water, Electricity, and Judicial Court records.
2. **State Adapter Pipeline**:
   Raw state JSON payloads undergo schema validation, term translation (e.g., `khatedarName` $\rightarrow$ `ownerName`), unit conversion (Acres/Cents/Kanal $\rightarrow$ $\text{m}^2$/Hectares), and canonical PostGIS storage.
3. **3-Layer GIS Spatial Model**:
   - **Base Cadastral Layer**: Realistic irregular contiguous parcel geometries with auto-zoom `fitBounds`.
   - **Essential Governance Layers**: Land-Use Zones, Master Plan Reservations, Utility Networks (Water/Power), Road Networks, Environmental Restrictions.
   - **Additional Layers**: Real-time Satellite Imagery (ArcGIS World Imagery & Carto Dark Basemaps).
4. **Interdepartmental Workflow Automation**:
   Deed Registration approval in the Registration Department automatically triggers a `Revenue Mutation Request` (`AUTOMATED_MUTATION`), updating the Record of Rights (RoR) and notifying the Tax Department to update property tax billing.
5. **Human-in-the-Loop AI Decision Support**:
   AI risk engines calculate 0–100 risk scores with explainable evidence factors (boundary overlaps, active disputes, tax arrears). Officers retain final decision authority and can click *"Investigate & Trigger Workflow"* to order ground field surveys.

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS / Tailwind CSS + shadcn/ui components (Dark Mode & Glassmorphism design system)
- **Mapping & GIS**: MapLibre GL JS v4.1.2 (Vector tile rendering, GeoJSON layers, bounding box calculation)
- **Icons**: Lucide React
- **Data Visualization**: Recharts

### Backend Architecture
- **Framework**: Java 17 + Spring Boot 3.2.3
- **Security**: Spring Security + JWT authentication foundation
- **ORM & Database Access**: Spring Data JPA + Hibernate Spatial
- **Spatial Support**: PostGIS spatial types & dialect (H2 spatial in-memory mode for zero-dependency local execution)
- **API Documentation**: OpenAPI / Swagger UI (`/swagger-ui.html`)

### AI Microservice Architecture
- **Framework**: Python 3.13 + FastAPI
- **Data Validation**: Pydantic v2 data models
- **Execution Server**: Uvicorn ASGI server (Port 8000)
- **Test Framework**: Pytest + FastAPI TestClient

### Database & GIS Storage
- **Database Engine**: PostgreSQL 16 + PostGIS 3.4 Extension
- **Spatial Data Types**: `GEOMETRY(Polygon, 4326)` for parcels, `GEOMETRY(MultiPolygon, 4326)` for zoning, `GEOMETRY(LineString, 4326)` for utilities and roads.

---

## 📱 Modules & Features Walkthrough

### 1. GIS Map Portal (`GisMapViewer.tsx`)
- **Realistic Cadastral Parcel Geometry**: Renders irregular contiguous polygons for Maharashtra (Paud, Haveli, Pune) and Tamil Nadu (Kanchipuram).
- **Cascading Locality Selector**: Filter by `State → District → Taluka → Village`.
- **Map Controls**: Layer toggles for Land-Use Zones, Master Plan 30m Ring Road alignment, Utility Networks, Road Networks, Spatial Restrictions, and Satellite Basemap.
- **Auto Viewport Bounds**: Automatically calculates spatial bounding box (`fitBounds`) upon locality selection.
- **DPI Disclaimer Badge**: Visual label stating *"Demonstration data — synthetic cadastral geometry"*.

### 2. 9-Tab Parcel Dossier Modal (`ParcelDetailModal.tsx`)
Clicking any parcel or entering an ULPIN opens an 800px drawer with 9 comprehensive tabs:
1. **Overview**: State, District, Taluka, Survey Plot Number, Area in $\text{m}^2$/Hectares, Primary Khatedar name.
2. **RoR (Record of Rights)**: State-specific extract details (MH 7/12 & 8A / TN Patta & Chitta / PB Jamabandi).
3. **Mutations**: Historical Ferfar mutation entries, approval dates, and pending applications.
4. **Deed Registration**: Sale deed registration numbers, consideration amounts, stamp duty paid, and buyer/seller details.
5. **Tax & Utilities**: Municipal property tax assessment, payment status, arrears, and water/electricity meter IDs.
6. **Disputes**: Revenue court civil suits, stay injunctions, and boundary overlap litigation.
7. **Documents**: Uploaded digital deed PDFs, digital signatures, and OCR verification status.
8. **Lifecycle Timeline**: Chronological history of land plot events from 2014 to present.
9. **AI Risk & Insights**: Unified 0–100 risk score, category risk breakdown bars, confidence metrics, evidence list, and officer recommendations.

### 3. Government Interoperability Dashboard (`GovernmentDashboard.tsx`)
- **Role Scope Switcher**: Switch views between `REVENUE_OFFICER`, `REGISTRATION_OFFICER`, `TAX_OFFICER`, `URBAN_PLANNING_OFFICER`, `DISPUTE_OFFICER`, and `GOV_ADMIN`.
- **Revenue Operational Queue**: Review pending mutation requests, approve RoR updates, and track interdepartmental triggers.
- **Deed Registration Queue**: Approve property sale deeds to automatically generate Revenue Mutation requests.
- **Property Tax Department**: View total assessed tax (₹14,80,000), total paid (₹14,75,200), and overdue arrears (₹4,800.00).
- **Urban Planning Department**: View PMRDA Master Plan 2030 Ring Road reservation impacts.
- **Tamper-Evident Audit Trail**: View real-time log of governance actions with user ID, role, department, action, ULPIN, previous value, new value, and timestamps.
- **Cross-State Schema Mapping Workbench**: Side-by-side visual mapping of raw state payloads (MH 7/12, TN Patta, PB Jamabandi) transformed into canonical `LandStackRecord` fields.

### 4. AI/ML Governance & Risk Engine (`AiGovernanceDashboard.tsx`)
- **Risk Metrics Cards**: Displays Total Alerts, Critical (76-100), High (51-75), Medium (21-50), Low (0-20), and Resolved counts.
- **Interactive Risk Queue**: Filter alerts by risk level or alert type (`BOUNDARY_CONFLICT`, `DISPUTE_RISK`, `TAX_RISK`, `MUTATION_ANOMALY`, `DOCUMENT_INCONSISTENCY`, `PLANNING_CONFLICT`).
- **Human-in-the-Loop Workflow Trigger**: Clicking *"Investigate & Trigger Workflow"* on an alert automatically creates a Revenue `FIELD_VERIFICATION` ServiceRequest and logs an audit record.
- **Satellite Computer Vision Change Detection**: Detects unauthorized structural footprint changes (0.14 Ha) on agricultural land by comparing baseline vs. current satellite feeds.

### 5. Natural Language AI Land Assistant (`LandAssistant.tsx`)
- Interactive drawer providing grounded answers to queries like *"Why is this parcel marked high risk?"* or *"What documents are available for this parcel?"*.
- Uses state-aware terminology (MH 7/12 & 8A, TN Patta/Chitta, PB Jamabandi) and distinguishes between **Fact Grounding**, **AI Inference**, and **Officer Recommendations**.

---

## 🔌 Complete REST API Reference

### 1. Location & Parcel APIs (Spring Boot)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations/states` | Fetch list of supported Indian states |
| `GET` | `/api/locations/districts?stateId={id}` | Fetch districts under a state |
| `GET` | `/api/locations/talukas?districtId={id}` | Fetch talukas/tehsils under a district |
| `GET` | `/api/locations/villages?talukaId={id}` | Fetch villages under a taluka |
| `GET` | `/api/parcels` | Fetch list of parcels by village/locality |
| `GET` | `/api/parcels/{ulpin}` | Fetch full parcel dossier by ULPIN |
| `GET` | `/api/parcels/{ulpin}/timeline` | Fetch chronological lifecycle timeline |

### 2. GIS Spatial APIs (Spring Boot)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/gis/parcels` | Fetch PostGIS GeoJSON polygons for cadastral map rendering |
| `GET` | `/api/gis/layers/{layerType}` | Fetch spatial layer features (Zoning, Master Plan, Utilities, Roads, Restrictions) |
| `GET` | `/api/gis/nearby` | Spatial proximity query using `ST_DWithin` |
| `GET` | `/api/gis/intersections` | PostGIS spatial intersection detection (`ST_Intersects`) |
| `GET` | `/api/gis/buffer` | PostGIS spatial buffer analysis (`ST_Buffer`) |
| `GET` | `/api/gis/spatial-risk` | PostGIS spatial planning risk scoring |

### 3. State Adapter APIs (Spring Boot)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/adapters/normalize` | Normalize raw state payload into canonical `LandStackRecord` |
| `GET` | `/api/adapters/supported-states` | Fetch state adapter status (MH, TN, PB) |

### 4. Interoperable Workflow & Audit APIs (Spring Boot)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/departments` | Fetch land governance departments |
| `GET` | `/api/service-requests` | Fetch active service requests (filterable by department) |
| `POST` | `/api/workflows/{id}/transition` | Process state machine transition (`SUBMITTED -> UNDER_REVIEW -> APPROVED -> COMPLETED`) |
| `GET` | `/api/audit` | Fetch tamper-evident audit logs |
| `GET` | `/api/schema-mapping` | Fetch cross-state schema mapping definition |
| `POST` | `/api/documents/verify` | Officer document verification API |

### 5. AI Governance APIs (Python FastAPI)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/health` | AI service health check endpoint |
| `POST` | `/api/ai/tax-risk` | Evaluate tax arrears & recovery risk score |
| `POST` | `/api/ai/dispute-risk` | Evaluate litigation & ownership transfer risk score |
| `POST` | `/api/ai/boundary-conflict` | Calculate cadastral boundary overlap risk score |
| `POST` | `/api/ai/mutation-anomaly` | Detect rapid mutation sequence anomalies |
| `POST` | `/api/ai/document-consistency` | OCR survey plot text vs. DB record consistency evaluation |
| `POST` | `/api/ai/planning-conflict` | Master plan & land-use zoning conflict evaluation |
| `POST` | `/api/ai/utility-anomaly` | Water/Power billing & connection anomaly detection |
| `POST` | `/api/ai/parcel-risk` | Calculate unified 0–100 parcel risk score with explainability factors |
| `POST` | `/api/ai/change-detection` | Satellite Computer Vision structural footprint change analysis |
| `POST` | `/api/ai/assistant` | Natural Language Land Assistant query endpoint |

### 6. Spring Boot AI Proxy APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/alerts` | Fetch active AI alerts |
| `POST` | `/api/ai/alerts/{id}/action` | Officer decision action (`ACKNOWLEDGE`, `INVESTIGATE`, `RESOLVE`, `DISMISS`) |
| `GET` | `/api/ai/parcel-risk/{ulpin}` | Fetch parcel risk summary |
| `POST` | `/api/ai/assistant/query` | Proxy query to AI Land Assistant |

---

## 🗄 Database Schema Reference

The platform uses Flyway SQL migrations (`database/migrations/`):
- `V1__init_landstack_schema.sql`: Core tables (`states`, `districts`, `talukas`, `villages`, `parcels`, `ror_records`, `mutations`, `registrations`, `tax_records`, `utility_records`, `disputes`, `documents`).
- `V4__init_spatial_layers_schema.sql`: PostGIS spatial tables (`land_use_zones`, `zoning_zones`, `master_plan_zones`, `utility_networks`, `road_networks`, `restriction_zones`, `spatial_alerts`).
- `V6__update_irregular_parcels.sql`: Seeds irregular contiguous cadastral polygon geometries for Maharashtra (Paud, Haveli) and Tamil Nadu (Kanchipuram).
- `V7__init_workflows_and_audit_schema.sql`: Workflow tables (`departments`, `service_requests`, `workflow_instances`, `audit_logs`, `notifications`).
- `V9__init_ai_governance_schema.sql`: `ai_alerts` table storing risk scores, evidence, recommendations, and officer decision statuses.

---

## 🚀 Installation & Running Guide

### Prerequisites
- **Node.js**: v18.0+ & `npm`
- **Java**: JDK 17+
- **Maven**: 3.8+
- **Python**: 3.10+ (Python 3.13 recommended)

---

### Step 1: Start Python FastAPI AI Microservice (Port 8000)
```bash
cd ai-service
python3 -m uvicorn main:app --port 8000 --host 0.0.0.0
```
*Health Check*: [http://localhost:8000/api/ai/health](http://localhost:8000/api/ai/health)

---

### Step 2: Start Spring Boot Backend Server (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*Swagger UI*: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### Step 3: Start React + Vite Frontend Web App (Port 5173)
```bash
cd frontend
npm run dev
```
*Web Portal*: [http://localhost:5173](http://localhost:5173)

---

### Option 4: Docker Compose Setup
```bash
docker-compose up --build
```

---

## 🧪 Automated Testing Suite

### 1. Maven Backend Unit Tests (Java 17 / JUnit 5)
Executes `AiGovernanceTest`, `WorkflowEngineTest`, `SpatialGisTest`, and `ParcelServiceTest`.
```bash
cd backend
mvn test
```
*Result*: **15 / 15 Tests Passed** in 1.581s.

### 2. Python AI Service Tests (pytest)
Executes `test_ai.py` verifying health, tax risk, dispute risk, boundary conflict, unified parcel risk, and AI Land Assistant Pydantic contracts.
```bash
cd ai-service
python3 -m pytest test_ai.py
```
*Result*: **6 / 6 Pytest Tests Passed** in 0.18s.

### 3. Frontend Production Build Check (TypeScript & Vite)
Verifies clean compilation of all 1,493 React & MapLibre modules.
```bash
cd frontend
npm run build
```
*Result*: **Vite build completed cleanly** in 1.78s with 0 errors.

---

## 📄 License & Attribution

- **Project**: SIH26014 — Integrated GIS-Based Digital Public Infrastructure for Land Governance
- **Organization**: Ministry of Rural Development — Department of Land Resources (DoLR)
- **Map Data**: OpenStreetMap contributors, Carto Basemaps, ArcGIS World Imagery Tile Services
