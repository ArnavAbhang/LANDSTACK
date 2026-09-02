# Database Schema & PostGIS Architecture

## 1. Overview
Land Stack uses **PostgreSQL 16** with the **PostGIS 3** geospatial extension. The schema is normalized around the central `parcels` table.

## 2. Core ER Entities

### Spatial & Administrative Entities
- `states`: Administrative states (e.g. Maharashtra, Tamil Nadu).
- `districts`: Administrative districts.
- `localities`: Talukas/Tehsils and Villages.
- `parcels`: Central entity containing `ulpin`, `state_parcel_id`, survey number, area, land type, land use, and PostGIS `geometry` (`POLYGON, 4326`).

### Ownership & Governance Entities
- `owners`: Primary and co-owners with identification details.
- `ownership`: Links `owners` to `parcels` with share percentage and ownership type.
- `ror_records`: State-specific Record of Rights (MH 7/12 & 8A, TN Patta/Adangal, PB Jamabandi).
- `registrations`: Title deed registration records, transaction history, stamp duty details.
- `mutations`: Revenue mutation workflow entries (Ferfar/Transfer).

### Financial & Utility Connections
- `tax_records`: Property tax assessments, paid amounts, outstanding dues, payment dates.
- `utility_connections`: Water and electricity meter IDs, connection status, bill dues.

### Governance & Compliance
- `zoning`: Master plan zone classifications, setback rules, building permissions.
- `disputes`: Legal dispute status, court case references, conflict severity.
- `documents`: Verified digital documents with hash, QR verification tokens, MinIO file URLs.
- `service_requests`: Citizen applications and officer review steps.
- `ai_alerts`: System-generated alerts for tax, utility, boundary, or title risk.
- `audit_logs`: Immutable logs of user actions, department approvals, and data edits.
