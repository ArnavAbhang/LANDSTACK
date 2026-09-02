-- Land Stack Migration V10: Security, Privacy, RBAC, Jurisdiction & Audit Governance Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150),
    mobile VARCHAR(20),
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL, -- LAND_OWNER, REVENUE_OFFICER, REGISTRATION_OFFICER, TAX_OFFICER, PLANNING_OFFICER, UTILITY_OFFICER, DISPUTE_OFFICER, ADMIN
    department_code VARCHAR(50),
    state_code VARCHAR(10),
    district_id VARCHAR(50),
    taluka_id VARCHAR(50),
    village_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100),
    user_role VARCHAR(50),
    event_type VARCHAR(100) NOT NULL, -- UNAUTHORIZED_JURISDICTION_ACCESS, FORBIDDEN_RESOURCE_ACCESS, RAW_SOURCE_ACCESS_DENIED, REPEATED_FAILED_LOGIN, BULK_QUERY_DETECTED
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(30) DEFAULT 'NEW', -- NEW, ACKNOWLEDGED, INVESTIGATING, RESOLVED
    details TEXT,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    resource_ulpin VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_sec_events_timestamp ON security_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_sec_events_status ON security_events(status);

-- 3. Document Access Policies Table
CREATE TABLE IF NOT EXISTS document_access_policies (
    id VARCHAR(50) PRIMARY KEY,
    document_id VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    parcel_ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    classification VARCHAR(30) DEFAULT 'DEPARTMENT_ONLY', -- PUBLIC, OWNER_ONLY, DEPARTMENT_ONLY, RESTRICTED
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Extend Audit Log Table with Hash Chaining Fields
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS previous_hash VARCHAR(100);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS current_hash VARCHAR(100);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS result VARCHAR(30) DEFAULT 'SUCCESS';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS correlation_id VARCHAR(100);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_type VARCHAR(50);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_id VARCHAR(100);
