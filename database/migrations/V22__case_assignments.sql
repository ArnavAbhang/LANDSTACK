-- Land Stack Migration V22: Case Assignments Table

CREATE TABLE IF NOT EXISTS case_assignments (
    assignment_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES workflow_cases(case_id) ON DELETE CASCADE,
    officer_id VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assignment_status VARCHAR(30) DEFAULT 'ASSIGNED', -- ASSIGNED, IN_PROGRESS, COMPLETED, REASSIGNED
    remarks TEXT
);

CREATE INDEX IF NOT EXISTS idx_assign_case ON case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_assign_officer ON case_assignments(officer_id);
