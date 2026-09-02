-- Land Stack Seed Data V10 (Phase 4 AI Alerts Demo)

INSERT INTO ai_alerts (id, ulpin, alert_type, risk_score, risk_level, confidence, finding, evidence, recommendation, status) VALUES
(
    'ALT_AI_001', 'DEMO-MH-000003', 'BOUNDARY_CONFLICT', 85.00, 'CRITICAL', 0.96,
    'Cadastral Boundary Overlap Conflict',
    '["Spatial intersection of 130 m² detected between DEMO-MH-000002 and DEMO-MH-000003"]',
    'Initiate immediate ground field verification and survey record audit.', 'NEW'
),
(
    'ALT_AI_002', 'DEMO-MH-000003', 'DISPUTE_RISK', 78.00, 'HIGH', 0.87,
    'High Dispute Risk & Active Injunction',
    '["4 ownership changes in 36 months", "Active litigation CS/2024/9912 in Pune Civil Court"]',
    'Revenue officer review recommended before processing pending mutations.', 'NEW'
),
(
    'ALT_AI_003', 'DEMO-MH-000003', 'TAX_RISK', 65.00, 'HIGH', 0.94,
    'Property Tax Arrears Overdue',
    '["Overdue balance of ₹8,000 for 2 consecutive years"]',
    'Send tax payment reminder and block ownership transfer clearance.', 'NEW'
),
(
    'ALT_AI_004', 'DEMO-MH-000001', 'TAX_RISK', 35.00, 'MEDIUM', 0.88,
    'Minor Tax Arrears Warning',
    '["Outstanding tax balance ₹2,400 overdue by 45 days"]',
    'Notify land holder via digital citizen portal.', 'NEW'
)
ON CONFLICT (id) DO NOTHING;
