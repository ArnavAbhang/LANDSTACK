# LAND STACK — Phase 10 Case Management & Operational Control Center

## 1. Government Case Management Center
The Case Management Center (`CaseManagementDashboard.tsx`) provides government officers with jurisdiction-scoped case management:
- Overview metrics (Total Cases, Pending Field Verifications, SLA Compliance %, Escalations).
- Case Queue table with filters by State, District, Department, Priority, and Status.
- Action controls: Approve Case, Schedule Field Verification, Reject Case, Escalate Case.

## 2. Operations Control Center
The Control Center (`OperationsControlCenter.tsx`) provides state administrators with real-time operational command:
- Service delivery resolution metrics (Total Requests, SLA Compliance %, Average Resolution Time).
- Department performance breakdown (Revenue, Registration, Survey & Settlement).
- Geographic workload distribution by State, District, and Taluka.
