-- Land Stack Database Initialization Migration V1
-- PostgreSQL + PostGIS Schema for SIH26014 Digital Public Infrastructure

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Administrative Hierarchy
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(50) REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS localities (
    id VARCHAR(50) PRIMARY KEY,
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE,
    taluka_name VARCHAR(100) NOT NULL,
    village_name VARCHAR(100) NOT NULL,
    lgd_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Core Land Parcel Table
CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(20) UNIQUE NOT NULL,
    state_parcel_id VARCHAR(100) NOT NULL,
    state_id VARCHAR(50) REFERENCES states(id),
    district_id VARCHAR(50) REFERENCES districts(id),
    locality_id VARCHAR(50) REFERENCES localities(id),
    survey_number VARCHAR(100) NOT NULL,
    plot_number VARCHAR(50),
    area_sq_meters NUMERIC(12, 2) NOT NULL,
    area_display VARCHAR(50) NOT NULL, -- e.g., "1.25 Hectares" or "3.10 Acres"
    land_type VARCHAR(50) NOT NULL, -- Agricultural, Non-Agricultural, Forest, Govt
    land_use VARCHAR(50) NOT NULL,  -- Residential, Commercial, Crop, Industrial
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    geometry GEOMETRY(Polygon, 4326),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcels_ulpin ON parcels(ulpin);
CREATE INDEX IF NOT EXISTS idx_parcels_locality ON parcels(locality_id);
CREATE INDEX IF NOT EXISTS idx_parcels_geometry ON parcels USING GIST(geometry);

-- 3. Users & Auth
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL, -- LAND_OWNER, REVENUE_OFFICER, REGISTRATION_OFFICER, TAX_OFFICER, PLANNING_OFFICER, UTILITY_OFFICER, ADMIN
    department VARCHAR(100),
    state_id VARCHAR(50) REFERENCES states(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Owners & Ownership Links
CREATE TABLE IF NOT EXISTS owners (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    identifier_type VARCHAR(50), -- e.g., Aadhaar Hash, PAN, VoterID
    identifier_hash VARCHAR(255),
    address TEXT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ownership (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    owner_id VARCHAR(50) REFERENCES owners(id) ON DELETE CASCADE,
    ownership_type VARCHAR(50) NOT NULL, -- Sole, Co-owner, Trust, Govt
    share_percentage NUMERIC(5, 2) DEFAULT 100.00,
    acquisition_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. RoR (Record of Rights) Table
CREATE TABLE IF NOT EXISTS ror_records (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    state_document_type VARCHAR(50) NOT NULL, -- "7/12 Extract", "8A", "Patta", "Jamabandi"
    khata_number VARCHAR(50),
    patta_number VARCHAR(50),
    tenant_details TEXT,
    encumbrance_notes TEXT,
    land_revenue_tax NUMERIC(10, 2),
    raw_source_json JSONB,
    normalized_json JSONB,
    verification_status VARCHAR(30) DEFAULT 'SOURCE_VERIFIED',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Registrations & Mutations
CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    registration_number VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- Sale, Gift, Inheritance, Partition
    seller_name VARCHAR(150),
    buyer_name VARCHAR(150) NOT NULL,
    stamp_duty_paid NUMERIC(12, 2),
    sub_registrar_office VARCHAR(150),
    document_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mutations (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    mutation_number VARCHAR(100) NOT NULL,
    registration_id VARCHAR(50) REFERENCES registrations(id),
    mutation_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'APPROVED', -- PENDING, APPROVED, REJECTED
    initiated_date DATE NOT NULL,
    approved_date DATE,
    approving_officer VARCHAR(150),
    remarks TEXT
);

-- 7. Financial Dues (Tax & Utilities)
CREATE TABLE IF NOT EXISTS tax_records (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    assessment_year VARCHAR(20) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'PAID', -- PAID, PARTIAL, OVERDUE
    receipt_number VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS utility_connections (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    utility_type VARCHAR(50) NOT NULL, -- WATER, ELECTRICITY
    consumer_number VARCHAR(100) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    connection_status VARCHAR(30) DEFAULT 'ACTIVE',
    outstanding_dues NUMERIC(10, 2) DEFAULT 0.00,
    last_billed_date DATE
);

-- 8. Disputes & Encumbrances
CREATE TABLE IF NOT EXISTS encumbrances (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    encumbrance_type VARCHAR(50) NOT NULL, -- MORTGAGE, LIEN, COURT_STAY
    financial_institution VARCHAR(150),
    amount_encumbered NUMERIC(12, 2),
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, RELEASED
    registered_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS disputes (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    case_number VARCHAR(100) NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    dispute_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'UNDER_REVIEW', -- DETECTED, FILED, UNDER_REVIEW, RESOLVED
    risk_level VARCHAR(20) DEFAULT 'MEDIUM',
    summary TEXT,
    filed_date DATE NOT NULL
);

-- 9. Documents, Service Requests, AI Alerts, Audit Logs
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    document_title VARCHAR(150) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    state_id VARCHAR(50) REFERENCES states(id),
    department VARCHAR(100) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_hash VARCHAR(255) NOT NULL,
    qr_verification_code VARCHAR(100) UNIQUE NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'VERIFIED',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_requests (
    id VARCHAR(50) PRIMARY KEY,
    request_number VARCHAR(100) UNIQUE NOT NULL,
    parcel_id VARCHAR(50) REFERENCES parcels(id),
    applicant_id VARCHAR(50) REFERENCES users(id),
    service_type VARCHAR(100) NOT NULL, -- MUTATION_INQUIRY, ROR_CORRECTION, CLEARANCE_CERTIFICATE, DISPUTE_FILING
    department VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
    assigned_officer VARCHAR(150),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_alerts (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- TAX_DUE, UTILITY_DUE, DISPUTE_RISK, GEOMETRY_OVERLAP
    severity VARCHAR(20) NOT NULL,   -- LOW, MEDIUM, HIGH, CRITICAL
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    explainability_factors JSONB,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    user_role VARCHAR(50),
    department VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    parcel_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS state_adapters (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(50) REFERENCES states(id),
    adapter_name VARCHAR(100) NOT NULL,
    source_document_types TEXT[] NOT NULL,
    field_mappings JSONB NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
