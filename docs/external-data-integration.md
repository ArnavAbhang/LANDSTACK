# LAND STACK — Phase 9 External Data Source & Connector Architecture

## 1. Overview
Phase 9 establishes the production-oriented readiness layer of **LAND STACK (SIH26014)** to connect with real-world state revenue portals, cadastral GIS repositories, registration databases, property tax systems, and satellite imagery providers.

---

## 2. External Data Source Registry
External data sources are tracked in `ExternalDataSource.java` with strict status classification:

- `CONNECTED`: Live external government API connection verified and active.
- `AVAILABLE`: External system endpoints available for integration.
- `READY`: Integration adapter configured and tested.
- `SIMULATED`: Prototype mock data source (explicitly tagged to prevent false claims of live government connectivity).
- `OFFLINE`: External system temporarily unreachable.

---

## 3. Extensible Connector Architecture (`com.landstack.integration`)

```
             EXTERNAL DATA SOURCE REGISTRY
                           │
                           v
                   CONNECTOR FACTORY
     (Selects connector by protocol: REST, WMS, WFS, GEOJSON)
                           │
        ┌──────────────────┼──────────────────┐
        v                  v                  v
  RestConnector      GeoJsonConnector    WfsConnector
        │                  │                  │
        └──────────────────┼──────────────────┘
                           v
                    RAW SOURCE DATA
                           │
                           v
               GEOMETRY & CRS VALIDATION
                           │
                           v
                 CANONICAL LAND STACK MODEL
```

---

## 4. REST APIs

- `GET /api/integrations/sources`: List external data sources.
- `GET /api/integrations/sources/{id}`: Detailed source configuration.
- `POST /api/integrations/import`: Multi-step GeoJSON dataset import into PostGIS.
- `POST /api/integrations/validate`: Run CRS and geometry validation.
- `GET /api/integrations/jobs`: Integration job execution log.
- `POST /api/integrations/sync/{sourceId}`: Trigger state data synchronization.
