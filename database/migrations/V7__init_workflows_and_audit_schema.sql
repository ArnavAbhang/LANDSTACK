-- Land Stack Migration V7: Department Workflows, Audit Trail & Interoperability Schema

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL, -- REVENUE, REGISTRATION, TAX, URBAN_PLANNING, WATER, ELECTRICITY, DISPUTE, GOV_ADMIN
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 2. Service Requests Table (Citizen Initiated)
CREATE TABLE IF NOT EXISTS service_requests (
    id VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_role VARCHAR(50) DEFAULT 'LAND_OWNER',
    request_type VARCHAR(50) NOT NULL, -- MUTATION_REQUEST, OWNERSHIP_TRANSFER, TAX_CLEARANCE, DISPUTE_REGISTRATION, UTILITY_CONNECT
    department_code VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, FIELD_VERIFICATION, APPROVAL_PENDING, APPROVED, REJECTED, COMPLETED
    assigned_officer VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'NORMAL',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Workflow Instances Table (State Machine History)
CREATE TABLE IF NOT EXISTS workflow_instances (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES service_requests(id) ON DELETE CASCADE,
    ulpin VARCHAR(50) NOT NULL,
    current_state VARCHAR(30) NOT NULL,
    previous_state VARCHAR(30),
    actor_role VARCHAR(50) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(30) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Audit Log Table (Tamper-Evident Governance Event Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- APPROVED_MUTATION, VERIFIED_DEED, CREATED_WORKFLOW, UPDATED_TAX_STATUS
    ulpin VARCHAR(50) NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1'
);
CREATE INDEX IF NOT EXISTS idx_audit_ulpin ON audit_logs(ulpin);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);

-- 5. In-App Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    recipient_role VARCHAR(50) NOT NULL,
    ulpin VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
