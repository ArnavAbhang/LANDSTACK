# LAND STACK — Phase 11 Production System Architecture

## 1. System Overview
**LAND STACK (SIH26014)** is an integrated GIS-based Digital Public Infrastructure (DPI) platform for land governance, combining state revenue adapters, cadastral spatial geometry management, workflow automation, AI-assisted risk detection, and audit governance.

---

## 2. Full Architectural Topology

```
                              USERS
         (Citizens / Government Officers / System Admins)
                               │
                               v
                     FRONTEND LAYER (React 18)
           (MapLibre GIS / Dashboards / ErrorBoundary)
                               │
                               v
                     REVERSE PROXY (Nginx)
           (SSL / CORS / Rate Limiting / Static Assets)
                               │
                               v
                     API / SECURITY LAYER
        (RBAC / JBAC / X-Correlation-ID Filter / PII Masking)
                               │
                               v
                 SPRING BOOT 3.2 CORE BACKEND
       (Service Requests / Workflow Engine / SLA / Integration)
                               │
        ┌──────────────────────┼──────────────────────┐
        v                      v                      v
POSTGIS DATABASE        PYTHON AI SERVICE     INTEGRATION ENGINE
(PostgreSQL 15 + GiST) (FastAPI Microservice) (MH / TN / PB Adapters)
        │                      │                      │
        v                      v                      v
BACKUP / WAL ARCHIVE   HUMAN REVIEW FALLBACK  EXTERNAL STATE REPOSITORIES
```
