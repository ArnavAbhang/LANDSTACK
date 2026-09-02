# LAND STACK — Ownership Relationship Model Specification

## 1. Ownership Graph Dynamics
The `Ownership` entity models the relational linkage between Person ID and ULPIN land parcels:

1. **One Person $\rightarrow$ Multiple Parcels**:
   - `LS-PER-00000125` owns `MH-27-PUN-000003`, `MH-27-PUN-000847`, and `MH-27-PUN-001204`.
2. **One Parcel (ULPIN) $\rightarrow$ Multiple Owners (Joint Ownership)**:
   - `MH-27-PUN-000003`: Rahul Anil Deshmukh (70% share) & Sneha Deshmukh (30% share).

## 2. Ownership Types & Statuses
- **Ownership Types**: `SOLE`, `JOINT`, `INHERITED`, `LEGAL_REPRESENTATIVE`, `OTHER`.
- **Statuses**: `ACTIVE`, `HISTORICAL`, `PENDING`, `DISPUTED`.
