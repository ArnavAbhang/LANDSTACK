# LAND STACK — Phase 11 System Observability & Tracing

## 1. Metrics & Health REST Endpoints
- `GET /api/health`: Comprehensive system health report.
- `GET /api/health/database`: PostgreSQL connection pool & latency.
- `GET /api/health/postgis`: PostGIS spatial extension & GiST index status.
- `GET /api/health/ai`: Python AI microservice status & fallback mode.
- `GET /api/health/integrations`: Connector health & state adapter status.
- `GET /api/metrics/summary`: Request counts, average latency, 4xx/5xx error rates, active workflow cases.

## 2. Distributed Tracing with X-Correlation-ID
Every HTTP request receives an `X-Correlation-ID` header injected by `ApiMetricsFilter.java`. This correlation ID propagates across Spring Boot services, audit logs, security events, and AI service calls.
