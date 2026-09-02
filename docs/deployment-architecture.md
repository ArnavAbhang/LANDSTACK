# LAND STACK — Phase 11 Deployment Architecture

## 1. Containerization & Docker Stack
LAND STACK is deployed via `docker-compose.yml` across four containerized services:
- `db`: PostgreSQL 15 + PostGIS 3.3 Database with spatial GiST indexing.
- `ai-service`: Python FastAPI microservice for land risk scoring.
- `backend`: Spring Boot 3.2.3 Java 17 REST API engine.
- `frontend`: React 18 + Vite production build served via Nginx.

## 2. Environment Variables Configuration
Production secrets (JWT keys, DB passwords, API credentials) are injected via environment variables:
- `SPRING_PROFILES_ACTIVE=prod`
- `SPRING_DATASOURCE_URL`
- `POSTGRES_PASSWORD`
- `AI_SERVICE_URL`
