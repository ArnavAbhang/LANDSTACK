# LAND STACK — Phase 10 Controlled Workflow State Machine Architecture

## 1. Controlled State Machine Rules
The workflow engine in `WorkflowCaseService.java` strictly enforces valid state transitions to guarantee legal procedural integrity:

```
  SUBMITTED
     │
     v
  UNDER_VALIDATION ────► REJECTED ────► CLOSED
     │
     v
  ASSIGNED ───► REASSIGNED / ESCALATED
     │
     v
  UNDER_REVIEW
     │
     ├───────────► FIELD_VERIFICATION_REQUIRED ──► FIELD_VERIFICATION
     │                                                   │
     ▼                                                   ▼
  APPROVED ◄─────────────────────────────────────────────┘
     │
     v
  COMPLETED
     │
     v
  CLOSED
```

## 2. Invalid Transition Enforcement
Transitions attempting to bypass steps (e.g., `SUBMITTED` $\rightarrow$ `APPROVED`) or modify closed cases (e.g., `CLOSED` $\rightarrow$ `UNDER_REVIEW`) are rejected with `400 Bad Request` or `IllegalStateException`.

Every transition records actor identity, role, department, jurisdiction, SHA-256 audit record, timestamp, and justification reason.
