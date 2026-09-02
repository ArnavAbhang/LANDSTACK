-- Land Stack Migration V25: SLA Tracking Table

CREATE TABLE IF NOT EXISTS sla_tracking (
    sla_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES workflow_cases(case_id) ON DELETE CASCADE,
    target_hours INT NOT NULL DEFAULT 72,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    elapsed_hours INT DEFAULT 0,
    remaining_hours INT DEFAULT 72,
    sla_status VARCHAR(30) DEFAULT 'ON_TRACK', -- ON_TRACK, AT_RISK, BREACHED, COMPLETED
    escalation_level INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sla_case ON sla_tracking(case_id);
CREATE INDEX IF NOT EXISTS idx_sla_status ON sla_tracking(sla_status);
