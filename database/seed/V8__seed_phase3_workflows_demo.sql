-- Land Stack Seed Data V8 (Phase 3 Workflows & Audit Demo)

-- 1. Insert Departments
INSERT INTO departments (id, code, name, description) VALUES
('DEP_REV', 'REVENUE', 'Department of Land Revenue', 'Manages RoR 7/12, 8A Extracts, Ferfar Mutations, and Land Records'),
('DEP_REG', 'REGISTRATION', 'Department of Registration & Stamps', 'Handles Property Registration, Deed Transfers, and Encumbrances'),
('DEP_TAX', 'TAX', 'Municipal Land Tax Department', 'Manages Property Tax Assessments, Dues, and Clearance Certificates'),
('DEP_PLAN', 'URBAN_PLANNING', 'Urban Development & Master Planning', 'Handles Zoning Classification, Building Permissions, and Ring Road Plans'),
('DEP_WTR', 'WATER', 'Water Supply & Sewerage Board', 'Manages Municipal Water Infrastructure Connections and Metering'),
('DEP_PWR', 'ELECTRICITY', 'State Power Distribution Corporation', 'Manages High Tension and Commercial Power Connections'),
('DEP_DISP', 'DISPUTE', 'Land Disputes & Revenue Court', 'Handles Civil Suits, Boundary Overlaps, and Title Injunctions')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Service Requests
INSERT INTO service_requests (id, ulpin, applicant_name, applicant_role, request_type, department_code, status, assigned_officer, priority, details) VALUES
(
    'REQ-2026-001', 'MH-27-PUN-001-8472', 'Ramesh Anant Kulkarni', 'LAND_OWNER',
    'MUTATION_REQUEST', 'REVENUE', 'UNDER_REVIEW', 'Tahashildar Haveli', 'HIGH',
    'Application for Co-ownership Ferfar Mutation under Mutation Entry No 1902.'
),
(
    'REQ-2026-002', 'MH-27-PUN-002-9103', 'Sunita Kulkarni', 'LAND_OWNER',
    'OWNERSHIP_TRANSFER', 'REGISTRATION', 'APPROVAL_PENDING', 'Sub-Registrar Haveli', 'HIGH',
    'Deed Registration REG-PUN-2020-0192 pending interdepartmental revenue trigger.'
),
(
    'REQ-2026-003', 'DEMO-MH-000003', 'Sunil Pawar', 'LAND_OWNER',
    'TAX_CLEARANCE', 'TAX', 'SUBMITTED', 'Tax Assessor Haveli', 'NORMAL',
    'Request for No Dues Tax Clearance Certificate.'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Workflow Instances
INSERT INTO workflow_instances (id, request_id, ulpin, current_state, previous_state, actor_role, actor_name, department_code, comments) VALUES
('WF_01', 'REQ-2026-001', 'MH-27-PUN-001-8472', 'SUBMITTED', NULL, 'LAND_OWNER', 'Ramesh Anant Kulkarni', 'REVENUE', 'Submitted online via Citizen Portal.'),
('WF_02', 'REQ-2026-001', 'MH-27-PUN-001-8472', 'UNDER_REVIEW', 'SUBMITTED', 'REVENUE_OFFICER', 'Tahashildar Haveli', 'REVENUE', 'Verified initial 7/12 extract and fee receipt.')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Audit Events
INSERT INTO audit_logs (id, timestamp, user_id, role, department, action, ulpin, previous_value, new_value) VALUES
('AUD_01', CURRENT_TIMESTAMP - INTERVAL '2 HOURS', 'usr_reg_01', 'REGISTRATION_OFFICER', 'REGISTRATION', 'VERIFIED_DEED', 'MH-27-PUN-001-8472', 'Deed Status: DRAFT', 'Deed Status: VERIFIED'),
('AUD_02', CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 'usr_rev_01', 'REVENUE_OFFICER', 'REVENUE', 'CREATED_MUTATION_TRIGGER', 'MH-27-PUN-001-8472', 'Mutation: NONE', 'Mutation: PENDING_APPROVAL')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Notifications
INSERT INTO notifications (id, recipient_role, ulpin, title, message, is_read) VALUES
('NTF_01', 'LAND_OWNER', 'MH-27-PUN-001-8472', 'Mutation Status Updated', 'Your Mutation Request REQ-2026-001 is currently Under Review by Revenue Department.', false)
ON CONFLICT (id) DO NOTHING;
