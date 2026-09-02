-- Land Stack Seed Data V2
-- Mock Datasets for Maharashtra (Pune / Mulshi / Paud) & Tamil Nadu (Kanchipuram / Chengalpattu / Sriperumbudur)

-- 1. States & Administrative Hierarchy
INSERT INTO states (id, name, code) VALUES 
('ST_MH', 'Maharashtra', 'MH'),
('ST_TN', 'Tamil Nadu', 'TN'),
('ST_PB', 'Punjab', 'PB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, state_id, name, code) VALUES 
('DIST_PUNE', 'ST_MH', 'Pune', 'PUN'),
('DIST_KANCHI', 'ST_TN', 'Kanchipuram', 'KCH')
ON CONFLICT (id) DO NOTHING;

INSERT INTO localities (id, district_id, taluka_name, village_name, lgd_code) VALUES 
('LOC_PAUD', 'DIST_PUNE', 'Mulshi', 'Paud', '556421'),
('LOC_SRIPER', 'DIST_KANCHI', 'Chengalpattu', 'Sriperumbudur', '631501')
ON CONFLICT (id) DO NOTHING;

-- 2. Maharashtra Parcels (Pune, Mulshi, Paud)
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry
) VALUES 
(
    'PCL_MH_001', 'MH-27-PUN-001-8472', 'MH-PUN-MUL-PAUD-712-45/1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '45/1', 'Plot-12', 12500.00, '1.25 Hectare',
    'Agricultural', 'Crop Cultivation', 18.532400, 73.614200,
    ST_GeomFromText('POLYGON((73.6140 18.5320, 73.6150 18.5320, 73.6150 18.5330, 73.6140 18.5330, 73.6140 18.5320))', 4326)
),
(
    'PCL_MH_002', 'MH-27-PUN-002-9103', 'MH-PUN-MUL-PAUD-712-45/2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '45/2', 'Plot-14', 8500.00, '0.85 Hectare',
    'Non-Agricultural', 'Residential', 18.533500, 73.615200,
    ST_GeomFromText('POLYGON((73.6150 18.5330, 73.6160 18.5330, 73.6160 18.5340, 73.6150 18.5340, 73.6150 18.5330))', 4326)
),
(
    'PCL_MH_003', 'MH-27-PUN-003-3341', 'MH-PUN-MUL-PAUD-712-89/A', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '89/A', 'Plot-05', 21000.00, '2.10 Hectare',
    'Commercial', 'IT Park & Warehousing', 18.531000, 73.612000,
    ST_GeomFromText('POLYGON((73.6115 18.5305, 73.6130 18.5305, 73.6130 18.5318, 73.6115 18.5318, 73.6115 18.5305))', 4326)
)
ON CONFLICT (id) DO NOTHING;

-- 3. Tamil Nadu Parcels (Kanchipuram, Chengalpattu, Sriperumbudur)
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry
) VALUES 
(
    'PCL_TN_001', 'TN-33-KCH-001-4412', 'TN-KCH-CHE-SRI-PATTA-1082', 'ST_TN', 'DIST_KANCHI', 'LOC_SRIPER',
    '112/3A', 'Patta-1082', 16187.00, '4.00 Acres (Nanjai)',
    'Agricultural (Nanjai)', 'Paddy Cultivation', 12.968000, 79.941000,
    ST_GeomFromText('POLYGON((79.9400 12.9670, 79.9420 12.9670, 79.9420 12.9690, 79.9400 12.9690, 79.9400 12.9670))', 4326)
),
(
    'PCL_TN_002', 'TN-33-KCH-002-6029', 'TN-KCH-CHE-SRI-PATTA-2451', 'ST_TN', 'DIST_KANCHI', 'LOC_SRIPER',
    '145/1B', 'Patta-2451', 6070.00, '1.50 Acres (Punjai)',
    'Industrial', 'Auto Manufacturing Ancillary', 12.970000, 79.945000,
    ST_GeomFromText('POLYGON((79.9440 12.9695, 79.9460 12.9695, 79.9460 12.9710, 79.9440 12.9710, 79.9440 12.9695))', 4326)
)
ON CONFLICT (id) DO NOTHING;

-- 4. Owners & Ownership Links
INSERT INTO owners (id, full_name, identifier_type, identifier_hash, address, contact_number) VALUES 
('OWN_001', 'Ramesh Anant Kulkarni', 'Aadhaar Hash', 'e83a9f02c...', 'Flat 402, Paud Village, Mulshi, Pune, MH', '+91 98220 11223'),
('OWN_002', 'Sunita Ramesh Kulkarni', 'Aadhaar Hash', 'a19b8c72d...', 'Flat 402, Paud Village, Mulshi, Pune, MH', '+91 98220 44556'),
('OWN_003', 'M. Shanmugam', 'Aadhaar Hash', 'c771fa08d...', 'No 45, Main Road, Sriperumbudur, Kanchipuram, TN', '+91 94440 88990'),
('OWN_004', 'Apex Logistics Hub India Pvt Ltd', 'PAN', 'AAACA1234F', 'B-12 Industrial Zone, Pune, MH', '+91 20 6711 0000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ownership (id, parcel_id, owner_id, ownership_type, share_percentage, acquisition_date) VALUES 
('OWN_LNK_01', 'PCL_MH_001', 'OWN_001', 'Sole Owner', 100.00, '2014-04-12'),
('OWN_LNK_02', 'PCL_MH_002', 'OWN_001', 'Co-owner', 50.00, '2019-09-20'),
('OWN_LNK_03', 'PCL_MH_002', 'OWN_002', 'Co-owner', 50.00, '2019-09-20'),
('OWN_LNK_04', 'PCL_TN_001', 'OWN_003', 'Sole Owner', 100.00, '2011-06-15'),
('OWN_LNK_05', 'PCL_MH_003', 'OWN_004', 'Corporate', 100.00, '2021-11-05')
ON CONFLICT (id) DO NOTHING;

-- 5. RoR Records (Maharashtra 7/12 & Tamil Nadu Patta)
INSERT INTO ror_records (
    id, parcel_id, state_document_type, khata_number, patta_number,
    tenant_details, encumbrance_notes, land_revenue_tax,
    raw_source_json, normalized_json, verification_status
) VALUES 
(
    'ROR_MH_001', 'PCL_MH_001', '7/12 Extract', 'Khata-482', NULL,
    'Self Cultivated (Jirayat)', 'SBI Agricultural Loan Charge ₹2,50,000', 450.00,
    '{"khatedarName": "Ramesh Anant Kulkarni", "surveyNo": "45/1", "khataNo": "482", "areaHectare": "1.25", "jameenPrakar": "Jirayat", "bhogwataClass": "Class-1"}',
    '{"ownerName": "Ramesh Anant Kulkarni", "surveyNumber": "45/1", "areaSqMeters": 12500, "landType": "Agricultural", "normalizedStatus": "VERIFIED"}',
    'SOURCE_VERIFIED'
),
(
    'ROR_TN_001', 'PCL_TN_001', 'Patta', NULL, 'Patta-1082',
    'Direct Owner Cultivation', 'Nil', 320.00,
    '{"pattaHolder": "M. Shanmugam", "surveyNumber": "112/3A", "pattaNo": "1082", "extent": "4.00 Acres", "classification": "Nanjai Wet Land", "district": "Kanchipuram"}',
    '{"ownerName": "M. Shanmugam", "surveyNumber": "112/3A", "areaSqMeters": 16187, "landType": "Agricultural (Nanjai)", "normalizedStatus": "VERIFIED"}',
    'SOURCE_VERIFIED'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Financial Dues (Tax & Utility Dues)
INSERT INTO tax_records (id, parcel_id, assessment_year, tax_amount, amount_paid, due_date, status, receipt_number) VALUES 
('TAX_MH_01', 'PCL_MH_001', '2025-2026', 1250.00, 1250.00, '2025-12-31', 'PAID', 'MH-TAX-2025-8841'),
('TAX_MH_02', 'PCL_MH_002', '2025-2026', 4800.00, 0.00, '2026-03-31', 'OVERDUE', NULL),
('TAX_TN_01', 'PCL_TN_001', '2025-2026', 2100.00, 2100.00, '2025-11-30', 'PAID', 'TN-REV-2025-1029')
ON CONFLICT (id) DO NOTHING;

INSERT INTO utility_connections (id, parcel_id, utility_type, consumer_number, provider_name, connection_status, outstanding_dues, last_billed_date) VALUES 
('UTL_MH_01', 'PCL_MH_001', 'WATER', 'WTR-PUN-0847', 'MSEDCL / Local Panchayat', 'ACTIVE', 0.00, '2026-02-01'),
('UTL_MH_02', 'PCL_MH_002', 'ELECTRICITY', 'ELE-PUN-9921', 'MSEDCL Power Distribution', 'ACTIVE', 3450.00, '2026-02-15'),
('UTL_TN_01', 'PCL_TN_001', 'ELECTRICITY', 'TNEB-KCH-4412', 'TANGEDCO Tamil Nadu Electricity', 'ACTIVE', 0.00, '2026-02-10')
ON CONFLICT (id) DO NOTHING;

-- 7. Disputes & AI Alerts
INSERT INTO disputes (id, parcel_id, case_number, court_name, dispute_type, status, risk_level, summary, filed_date) VALUES 
(
    'DSP_MH_01', 'PCL_MH_002', 'CS/2024/9912', 'Civil Court Senior Division Pune', 'Boundary & Access Right Suit',
    'UNDER_REVIEW', 'HIGH', 'Adjacent owner claims 1.5 meter boundary line overlap along west fence.', '2024-08-14'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_alerts (id, parcel_id, alert_type, severity, title, description, explainability_factors, status) VALUES 
(
    'ALT_MH_01', 'PCL_MH_002', 'TAX_OVERDUE', 'MEDIUM', 'Property Tax Overdue Detected',
    'Property tax for FY 2025-2026 remains unpaid after due date of March 31.',
    '{"overdueAmount": 4800.00, "daysOverdue": 148, "penaltyRisk": "Active"}', 'ACTIVE'
),
(
    'ALT_MH_02', 'PCL_MH_002', 'DISPUTE_RISK', 'HIGH', 'Active Civil Suit & Boundary Anomaly',
    'High dispute risk due to active suit CS/2024/9912 and 3 ownership mutation changes in 4 years.',
    '{"frequentMutations": 3, "activeLitigation": true, "boundaryOverlapMeter": 1.5}', 'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- 8. State Adapters Configuration
INSERT INTO state_adapters (id, state_id, adapter_name, source_document_types, field_mappings, status) VALUES 
(
    'ADPTR_MH', 'ST_MH', 'Maharashtra State Land Adapter', ARRAY['7/12 Extract', '8A Extract', 'Mutation Ferfar'],
    '{"khatedarName": "ownerName", "surveyNo": "surveyNumber", "areaHectare": "areaSqMeters", "jameenPrakar": "landType", "khataNo": "khataNumber"}',
    'ACTIVE'
),
(
    'ADPTR_TN', 'ST_TN', 'Tamil Nadu State Land Adapter', ARRAY['Patta', 'Chitta', 'Adangal'],
    '{"pattaHolder": "ownerName", "surveyNumber": "surveyNumber", "extent": "areaSqMeters", "classification": "landType", "pattaNo": "pattaNumber"}',
    'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- 9. Initial Mock Users
INSERT INTO users (id, username, email, password_hash, full_name, phone, role, department, state_id) VALUES 
('USR_CITIZEN', 'citizen_ramesh', 'ramesh.kulkarni@example.com', '$2a$12$e83a9f02c...', 'Ramesh Anant Kulkarni', '+91 98220 11223', 'LAND_OWNER', 'Citizen Portal', 'ST_MH'),
('USR_REVENUE', 'officer_revenue', 'revenue.officer@mh.gov.in', '$2a$12$a19b8c72d...', 'Dnyaneshwar Patil', '+91 98220 99887', 'REVENUE_OFFICER', 'Revenue & Land Records', 'ST_MH'),
('USR_REGISTRATION', 'officer_reg', 'registrar.pune@mh.gov.in', '$2a$12$c771fa08d...', 'Sanjay Deshmukh', '+91 98220 77665', 'REGISTRATION_OFFICER', 'Property Registration', 'ST_MH'),
('USR_TAX', 'officer_tax', 'tax.pune@mh.gov.in', '$2a$12$e19f8a08d...', 'Meena Joshi', '+91 98220 55443', 'TAX_OFFICER', 'Property Tax Department', 'ST_MH'),
('USR_ADMIN', 'admin_landstack', 'admin@landstack.gov.in', '$2a$12$f99a08d1c...', 'System Administrator', '+91 11 2338 0000', 'ADMIN', 'Land Stack DPI Hub', NULL)
ON CONFLICT (id) DO NOTHING;
