# REST API Specifications — Land Stack

## 1. Base URL & Versioning
All backend endpoints are exposed under `/api/v1` or `/api`.

## 2. Endpoints Overview

### Health & System Status
- `GET /api/health`: System health and status check.
- `GET /api/integration/adapters`: List available state adapters (MH, TN, PB).
- `POST /api/integration/ingest`: Ingest raw state payload and normalize into Land Stack model.

### Locality & GIS Spatial APIs
- `GET /api/localities/states`: Returns list of available states.
- `GET /api/localities/districts?stateId={stateId}`: Returns districts in a state.
- `GET /api/localities/talukas?districtId={districtId}`: Returns talukas/tehsils.
- `GET /api/localities/villages?talukaId={talukaId}`: Returns villages/localities.
- `GET /api/parcels/geojson?villageId={villageId}`: Returns GeoJSON FeatureCollection of parcel geometries.
- `GET /api/parcels/{ulpin}`: Returns comprehensive parcel details (RoR, Reg, Tax, Utilities, Disputes).

### Authentication & User Service
- `POST /api/auth/login`: Authenticate citizen or government user, returns JWT token.
- `GET /api/auth/profile`: Get current authenticated user profile and scope.

### Governance & Service Requests
- `GET /api/services`: List service requests for user or department.
- `POST /api/services`: Create new service request (e.g. mutation status, RoR correction).
- `PUT /api/services/{id}/status`: Update workflow status (Department approval flow).

### AI Decision Support
- `POST /api/ai/dispute-risk`: Calculate dispute risk score and explainability factors.
- `POST /api/ai/tax-analysis`: Evaluate tax arrear patterns.
- `POST /api/ai/utility-alerts`: Detect outstanding water & electricity dues.
- `POST /api/ai/gis-conflict`: Spatial PostGIS geometry overlap & gap analysis.
