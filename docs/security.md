# Security & Role-Based Access Control (RBAC) Matrix

## 1. Authentication Framework
- Stateless **JWT (JSON Web Token)** authentication.
- Password hashing using BCrypt (`strength = 12`).
- Secure token expiration and refresh architecture.

## 2. Roles Matrix

| Role | Access Scope | Accessible Datasets & Features |
| :--- | :--- | :--- |
| `LAND_OWNER` / `CITIZEN` | Personal & Public | Public parcel search, personal RoR, tax payment, utility bills, service request tracking, document download. |
| `REVENUE_OFFICER` | Department (Revenue) | Full RoR, survey boundary verification, mutation approval, dispute review. |
| `REGISTRATION_OFFICER` | Department (Registration) | Title deed verification, transaction history, stamp duty records, mutation trigger. |
| `TAX_OFFICER` | Department (Tax) | Tax assessments, collection analytics, default notices, property valuation. |
| `PLANNING_OFFICER` | Department (Planning) | Master plan zoning, building permissions, land-use violations, spatial restrictions. |
| `UTILITY_OFFICER` | Department (Utilities) | Water/electricity connection management, clearance verification, supply networks. |
| `ADMIN` | System-Wide | User management, state adapter configuration, data quality reports, audit log inspection. |

## 3. Data Privacy Visibility Levels

- **Public**: ULPIN, parcel boundary geometry, village name, land type, land use, anonymized area.
- **Authenticated Owner**: Full owner details, 7/12 / Patta extract, mutation records, tax/utility dues, private documents.
- **Authorized Government Officer**: Complete department records, audit trail history, workflow action triggers, internal notes.
