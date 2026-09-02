# LAND STACK — Phase 11 API Versioning & Error Response Specification

## 1. Versioning Protocol
All production REST APIs follow standard URL path versioning: `/api/v1/...`.

## 2. Standardized Error Response Format
All error responses maintain a uniform JSON payload structure with `X-Correlation-ID`:

```json
{
  "timestamp": "2026-08-29T18:00:00Z",
  "status": 403,
  "error": "FORBIDDEN",
  "message": "Access Restricted: Action requires Government officer authorization.",
  "path": "/api/v1/service-requests/1/approve",
  "correlationId": "CORR-A8F912B4"
}
```
