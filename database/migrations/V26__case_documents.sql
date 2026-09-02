-- Land Stack Migration V26: Case Documents Table

CREATE TABLE IF NOT EXISTS case_documents (
    document_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES workflow_cases(case_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    classification VARCHAR(30) DEFAULT 'DEPARTMENT_ONLY', -- PUBLIC, OWNER_ONLY, DEPARTMENT_ONLY, RESTRICTED
    uploaded_by VARCHAR(100) NOT NULL,
    storage_reference VARCHAR(255) NOT NULL,
    checksum VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cdoc_case ON case_documents(case_id);
