-- Land Stack Migration V9: AI Governance, Risk Detection & Alerts Schema

CREATE TABLE IF NOT EXISTS ai_alerts (
    id VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- TAX_RISK, DISPUTE_RISK, BOUNDARY_CONFLICT, MUTATION_ANOMALY, DOCUMENT_INCONSISTENCY, PLANNING_CONFLICT, UTILITY_ANOMALY
    risk_score NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    confidence NUMERIC(3,2) NOT NULL, -- 0.00 to 1.00
    finding TEXT NOT NULL,
    evidence TEXT NOT NULL, -- JSON formatted array string
    recommendation TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'NEW', -- NEW, ACKNOWLEDGED, UNDER_REVIEW, RESOLVED, DISMISS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(100),
    officer_decision VARCHAR(50),
    officer_comment TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_alerts_ulpin ON ai_alerts(ulpin);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_risk ON ai_alerts(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_status ON ai_alerts(status);
