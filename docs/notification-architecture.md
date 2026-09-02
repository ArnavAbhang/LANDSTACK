# LAND STACK — Phase 10 Notification Architecture

## 1. Multi-Channel Notification Provider Abstraction
Notifications in `NotificationService.java` support four delivery channels:
- `IN_APP`: Active citizen & officer dashboard alerts (Status: `DELIVERED`).
- `EMAIL`: Email provider abstraction (Status: `SIMULATED` unless live provider configured).
- `SMS`: SMS gateway abstraction (Status: `SIMULATED` unless live gateway configured).
- `PUSH`: Mobile push notification abstraction (Status: `SIMULATED` unless live provider configured).

Explicit status tags (`DELIVERED` vs `SIMULATED`) guarantee transparency regarding external provider connections.
