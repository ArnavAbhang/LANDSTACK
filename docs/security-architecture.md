# LAND STACK — Phase 7 Security, Privacy & Audit Governance Architecture

## 1. Overview
As a Digital Public Infrastructure (DPI) for land governance, **LAND STACK** enforces end-to-end security, data privacy, role-based authorization (RBAC), jurisdiction-based access control (JBAC), PII owner data masking, and cryptographic tamper-evident audit logging (SHA-256 hash chaining).

---

## 2. Security Pipeline Architecture

```
                    USER REQUEST
                         │
                         v
              AUTHENTICATION ENGINE
         (Resident Mobile/OTP or Govt Official)
                         │
                         v
              AUTHORIZATION & RBAC MATRIX
    (LAND_OWNER, REVENUE, REGISTRATION, TAX, ADMIN)
                         │
                         v
         JURISDICTION-BASED ACCESS CONTROL (JBAC)
       (isAuthorizedForParcel(user, parcelState, dist, taluka))
                         │
        ┌────────────────┴────────────────┐
        v                                 v
  ALLOWED ACCESS                    DENIED (403)
        │                                 │
        v                                 v
PRIVACY MASKING DTO                LOG SECURITY EVENT
 (Public / Resident / Govt)         (UNAUTHORIZED_JURISDICTION_ACCESS)
        │                                 │
        └────────────────┬────────────────┘
                         v
            SHA-256 HASH CHAINED AUDIT LOG
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Role Code | User Description | Key Authorized Permissions |
| :--- | :--- | :--- |
| `LAND_OWNER` | Citizen Land Owner | `VIEW_OWN_PROPERTIES`, `VIEW_OWN_ROR`, `VIEW_OWN_TAX`, `CREATE_SERVICE_REQUEST` |
| `REVENUE_OFFICER` | Revenue & RoR Officer | `VIEW_PARCELS`, `VIEW_ROR`, `REVIEW_MUTATION`, `APPROVE_MUTATION`, `CREATE_FIELD_VERIFICATION` |
| `REGISTRATION_OFFICER` | Sub-Registrar Officer | `VIEW_REGISTRATION`, `PROCESS_REGISTRATION`, `VIEW_ENCUMBRANCE`, `VERIFY_DEED` |
| `TAX_OFFICER` | Property Tax Inspector | `VIEW_TAX`, `UPDATE_TAX_STATUS`, `RECORD_TAX_PAYMENT`, `VIEW_TAX_ANALYTICS` |
| `PLANNING_OFFICER` | Urban Planner | `VIEW_ZONING`, `VIEW_MASTER_PLAN`, `VIEW_LAND_USE`, `REVIEW_PLANNING_CONFLICT` |
| `UTILITY_OFFICER` | Utility Inspector | `VIEW_UTILITY_NETWORK`, `VIEW_UTILITY_CONNECTION`, `APPROVE_UTILITY_CONNECT` |
| `DISPUTE_OFFICER` | Revenue Court Officer | `VIEW_DISPUTES`, `UPDATE_DISPUTE_WORKFLOW`, `REVIEW_AI_ALERT`, `SCHEDULE_HEARING` |
| `ADMIN` | System Administrator | `SYSTEM_CONFIGURATION`, `USER_MANAGEMENT`, `AUDIT_ACCESS`, `VIEW_RAW_SOURCE` |

---

## 4. Jurisdiction-Based Access Control (JBAC)
Enforced at backend level via `JurisdictionAuthorizationService.java`:
```java
public boolean isAuthorizedForParcel(User user, String parcelState, String parcelDistrict, String parcelTaluka) {
    if ("ADMIN".equalsIgnoreCase(user.getRole())) return true;
    if ("LAND_OWNER".equalsIgnoreCase(user.getRole())) return true;

    if (user.getStateCode() != null && !user.getStateCode().equalsIgnoreCase(parcelState)) return false;
    if (user.getDistrictId() != null && !parcelDistrict.toLowerCase().contains(user.getDistrictId().toLowerCase())) return false;
    if (user.getTalukaId() != null && !parcelTaluka.toLowerCase().contains(user.getTalukaId().toLowerCase())) return false;

    return true;
}
```

---

## 5. PII Privacy Model & DTO Masking
- **Public Users**: Receive `PublicParcelDTO` where owner names are masked (e.g. `Rahul Anil Deshmukh` $\rightarrow$ `R. A. D*******`), and phone/email data are obscured.
- **Land Owners**: Receive `ResidentParcelDTO` showing full details of owned properties only.
- **Government Officers**: Receive `GovernmentParcelDTO` scoped to assigned role and jurisdiction.

---

## 6. Cryptographic SHA-256 Tamper-Evident Audit Trail
Audit records are mathematically chained:
$$\text{Record}_N.\text{currentHash} = \text{SHA-256}(\text{Record}_N.\text{previousHash} \parallel \text{Timestamp} \parallel \text{UserId} \parallel \text{Action} \parallel \text{ULPIN} \parallel \text{Result})$$

Verification via `GET /api/audit/integrity` checks hash continuity and flags any record tampering instantly.
