-- Land Stack Migration V30: Canonical Person Identity & Ownership Relationship Model

-- Canonical Person Table
CREATE TABLE IF NOT EXISTS persons (
    id BIGSERIAL PRIMARY KEY,
    person_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    state_code VARCHAR(10) NOT NULL,
    district_id VARCHAR(50) NOT NULL,
    taluka_id VARCHAR(50) NOT NULL,
    village_id VARCHAR(50) NOT NULL,
    identity_status VARCHAR(50) DEFAULT 'VERIFIED_PROTOTYPE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Canonical Ownership Relationship Table
CREATE TABLE IF NOT EXISTS ownerships (
    id BIGSERIAL PRIMARY KEY,
    ownership_id VARCHAR(64) NOT NULL UNIQUE,
    person_id VARCHAR(64) NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
    parcel_id BIGINT REFERENCES parcels(id) ON DELETE SET NULL,
    ulpin VARCHAR(128) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL DEFAULT 'SOLE', -- SOLE, JOINT, INHERITED, LEGAL_REPRESENTATIVE, OTHER
    ownership_share NUMERIC(5,2) DEFAULT 100.00,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_to DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, HISTORICAL, PENDING, DISPUTED
    source_record_id VARCHAR(100),
    source_state VARCHAR(50),
    source_system VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimized searching and identity traversal
CREATE INDEX IF NOT EXISTS idx_persons_person_id ON persons(person_id);
CREATE INDEX IF NOT EXISTS idx_persons_normalized_name ON persons(normalized_name);
CREATE INDEX IF NOT EXISTS idx_persons_jurisdiction ON persons(state_code, district_id, taluka_id, village_id);

CREATE INDEX IF NOT EXISTS idx_ownerships_person_id ON ownerships(person_id);
CREATE INDEX IF NOT EXISTS idx_ownerships_ulpin ON ownerships(ulpin);
CREATE INDEX IF NOT EXISTS idx_ownerships_status ON ownerships(status);

COMMENT ON TABLE persons IS 'Canonical Land Stack Person Identity Entity - App-level Person ID (LS-PER-XXXXXX)';
COMMENT ON TABLE ownerships IS 'Canonical Ownership Relationship linking Person ID to ULPIN land parcels with share % and status';
