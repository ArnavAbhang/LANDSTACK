-- Land Stack Migration V28: State-Scale Partitioning Strategy Documentation & Tables

-- Documentation of Partitioning Architecture:
-- At state-scale (10M+ parcel records), parcels and audit_logs are partitioned:
-- 1. parcels table partitioned BY LIST (state_code) -> parcels_mh, parcels_tn, parcels_pb
-- 2. audit_logs table partitioned BY RANGE (timestamp) -> audit_logs_2026_q1, audit_logs_2026_q2

-- Declarative schema references for production migration
COMMENT ON TABLE parcels IS 'LAND STACK Canonical Parcel Table - Partitioned by state_code at production scale';
COMMENT ON TABLE audit_logs IS 'LAND STACK Tamper-Evident Audit Table - Partitioned by timestamp range at production scale';
