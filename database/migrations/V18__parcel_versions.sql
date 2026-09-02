-- Land Stack Migration V18: Parcel Historical Versioning Table

CREATE TABLE IF NOT EXISTS parcel_versions (
    id VARCHAR(50) PRIMARY KEY,
    version_id VARCHAR(50) UNIQUE NOT NULL,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    source_system VARCHAR(100) NOT NULL,
    source_version VARCHAR(50),
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP WITH TIME ZONE,
    changed_fields TEXT,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'SYSTEM'
);

CREATE INDEX IF NOT EXISTS idx_parcel_ver_ulpin ON parcel_versions(ulpin);
