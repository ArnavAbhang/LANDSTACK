-- Land Stack Migration V21: Workflow Cases Table

CREATE TABLE IF NOT EXISTS workflow_cases (
    case_id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES service_requests(id) ON DELETE CASCADE,
    current_stage VARCHAR(50) NOT NULL,
    current_officer VARCHAR(100),
    department VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    sla_deadline TIMESTAMP WITH TIME ZONE,
    escalation_level INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_cases_request ON workflow_cases(request_id);
CREATE INDEX IF NOT EXISTS idx_cases_stage ON workflow_cases(current_stage);
