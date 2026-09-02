-- Land Stack Migration V23: Field Verifications Table

CREATE TABLE IF NOT EXISTS field_verifications (
    verification_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES workflow_cases(case_id) ON DELETE CASCADE,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    assigned_officer VARCHAR(100) NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    observations TEXT,
    verification_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, SCHEDULED, IN_PROGRESS, VERIFIED, FAILED, CANCELLED
    evidence_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fver_case ON field_verifications(case_id);
CREATE INDEX IF NOT EXISTS idx_fver_ulpin ON field_verifications(ulpin);
