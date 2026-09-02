# LAND STACK — Phase 10 Field Verification Architecture

## 1. Ground Truth Verification Principle
Physical field verifications in `FieldVerificationService.java` record on-site ground truth observations without automated legal mutations:

- Assigned officer identity.
- Scheduled GPS coordinates (`latitude`, `longitude`).
- Cadastral boundary observations & evidence references.
- Outcome status (`VERIFIED` or `FAILED`).

## 2. Human-in-the-Loop Principle
AI risk engine detections or satellite footprint anomalies spawn `FIELD_VERIFICATION_REQUIRED` cases assigned to human officers. AI never alters legal ownership or land records directly.
