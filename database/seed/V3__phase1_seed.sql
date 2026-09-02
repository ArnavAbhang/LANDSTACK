-- Land Stack Seed Data V3 (Phase 1 Expansion)
-- 10 Maharashtra Parcels (Pune / Haveli / Paud) & 10 Tamil Nadu Parcels (Kanchipuram / Chengalpattu / Sriperumbudur)

-- 1. Expanded Localities
INSERT INTO localities (id, district_id, taluka_name, village_name, lgd_code) VALUES 
('LOC_HAVELI', 'DIST_PUNE', 'Haveli', 'Demo Village Haveli', '556425'),
('LOC_TN_DEMO', 'DIST_KANCHI', 'Chengalpattu', 'Demo Village Kanchipuram', '631505')
ON CONFLICT (id) DO NOTHING;

-- 2. 10 Maharashtra Parcels
INSERT INTO parcels (id, ulpin, state_parcel_id, state_id, district_id, locality_id, survey_number, plot_number, area_sq_meters, area_display, land_type, land_use, latitude, longitude, geometry) VALUES
('PCL_MH_101', 'DEMO-MH-000001', 'MH-PUN-HAV-DEMO-101', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '123/4', 'Plot-01', 24500.00, '2.45 Hectares', 'Agricultural', 'Crop Cultivation', 18.5200, 73.8500, ST_GeomFromText('POLYGON((73.8490 18.5190, 73.8510 18.5190, 73.8510 18.5210, 73.8490 18.5210, 73.8490 18.5190))', 4326)),
('PCL_MH_102', 'DEMO-MH-000002', 'MH-PUN-HAV-DEMO-102', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '123/5', 'Plot-02', 18000.00, '1.80 Hectares', 'Agricultural', 'Horticulture', 18.5220, 73.8520, ST_GeomFromText('POLYGON((73.8510 18.5210, 73.8530 18.5210, 73.8530 18.5230, 73.8510 18.5230, 73.8510 18.5210))', 4326)),
('PCL_MH_103', 'DEMO-MH-000003', 'MH-PUN-HAV-DEMO-103', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '124/1', 'Plot-03', 12000.00, '1.20 Hectares', 'Non-Agricultural', 'Residential Township', 18.5240, 73.8540, ST_GeomFromText('POLYGON((73.8530 18.5230, 73.8550 18.5230, 73.8550 18.5250, 73.8530 18.5250, 73.8530 18.5230))', 4326)),
('PCL_MH_104', 'DEMO-MH-000004', 'MH-PUN-HAV-DEMO-104', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '124/2', 'Plot-04', 9500.00, '0.95 Hectare', 'Commercial', 'Shopping Complex', 18.5260, 73.8560, ST_GeomFromText('POLYGON((73.8550 18.5250, 73.8570 18.5250, 73.8570 18.5270, 73.8550 18.5270, 73.8550 18.5250))', 4326)),
('PCL_MH_105', 'DEMO-MH-000005', 'MH-PUN-HAV-DEMO-105', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '125/A', 'Plot-05', 31000.00, '3.10 Hectares', 'Industrial', 'Manufacturing Plant', 18.5280, 73.8580, ST_GeomFromText('POLYGON((73.8570 18.5270, 73.8590 18.5270, 73.8590 18.5290, 73.8570 18.5290, 73.8570 18.5270))', 4326)),
('PCL_MH_106', 'DEMO-MH-000006', 'MH-PUN-HAV-DEMO-106', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '126/B', 'Plot-06', 15000.00, '1.50 Hectares', 'Agricultural', 'Sugarcane Crop', 18.5300, 73.8600, ST_GeomFromText('POLYGON((73.8590 18.5290, 73.8610 18.5290, 73.8610 18.5310, 73.8590 18.5310, 73.8590 18.5290))', 4326)),
('PCL_MH_107', 'DEMO-MH-000007', 'MH-PUN-HAV-DEMO-107', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '127/1', 'Plot-07', 8000.00, '0.80 Hectare', 'Government', 'Public Water Works', 18.5320, 73.8620, ST_GeomFromText('POLYGON((73.8610 18.5310, 73.8630 18.5310, 73.8630 18.5330, 73.8610 18.5330, 73.8610 18.5310))', 4326)),
('PCL_MH_108', 'DEMO-MH-000008', 'MH-PUN-HAV-DEMO-108', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '128/3', 'Plot-08', 22000.00, '2.20 Hectares', 'Agricultural', 'Paddy Field', 18.5340, 73.8640, ST_GeomFromText('POLYGON((73.8630 18.5330, 73.8650 18.5330, 73.8650 18.5350, 73.8630 18.5350, 73.8630 18.5330))', 4326)),
('PCL_MH_109', 'DEMO-MH-000009', 'MH-PUN-HAV-DEMO-109', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '129/A', 'Plot-09', 14000.00, '1.40 Hectares', 'Non-Agricultural', 'Commercial IT Park', 18.5360, 73.8660, ST_GeomFromText('POLYGON((73.8650 18.5350, 73.8670 18.5350, 73.8670 18.5370, 73.8650 18.5370, 73.8650 18.5350))', 4326)),
('PCL_MH_110', 'DEMO-MH-000010', 'MH-PUN-HAV-DEMO-110', 'ST_MH', 'DIST_PUNE', 'LOC_HAVELI', '130/2', 'Plot-10', 27000.00, '2.70 Hectares', 'Forest/Reserve', 'Social Forestry', 18.5380, 73.8680, ST_GeomFromText('POLYGON((73.8670 18.5370, 73.8690 18.5370, 73.8690 18.5390, 73.8670 18.5390, 73.8670 18.5370))', 4326))
ON CONFLICT (id) DO NOTHING;

-- 3. 10 Tamil Nadu Parcels
INSERT INTO parcels (id, ulpin, state_parcel_id, state_id, district_id, locality_id, survey_number, plot_number, area_sq_meters, area_display, land_type, land_use, latitude, longitude, geometry) VALUES
('PCL_TN_101', 'DEMO-TN-000001', 'TN-KCH-CHE-DEMO-101', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '201/1A', 'Patta-501', 16187.00, '4.00 Acres (Nanjai)', 'Agricultural (Nanjai)', 'Paddy Cultivation', 12.9500, 79.9300, ST_GeomFromText('POLYGON((79.9290 12.9490, 79.9310 12.9490, 79.9310 12.9510, 79.9290 12.9510, 79.9290 12.9490))', 4326)),
('PCL_TN_102', 'DEMO-TN-000002', 'TN-KCH-CHE-DEMO-102', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '201/2B', 'Patta-502', 12140.00, '3.00 Acres (Punjai)', 'Agricultural (Punjai)', 'Groundnut Crop', 12.9520, 79.9320, ST_GeomFromText('POLYGON((79.9310 12.9510, 79.9330 12.9510, 79.9330 12.9530, 79.9310 12.9530, 79.9310 12.9510))', 4326)),
('PCL_TN_103', 'DEMO-TN-000003', 'TN-KCH-CHE-DEMO-103', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '202/1', 'Patta-503', 8093.00, '2.00 Acres (Punjai)', 'Residential', 'Housing Layout', 12.9540, 79.9340, ST_GeomFromText('POLYGON((79.9330 12.9530, 79.9350 12.9530, 79.9350 12.9550, 79.9330 12.9550, 79.9330 12.9530))', 4326)),
('PCL_TN_104', 'DEMO-TN-000004', 'TN-KCH-CHE-DEMO-104', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '202/3', 'Patta-504', 20234.00, '5.00 Acres (Nanjai)', 'Industrial', 'Textile Processing Unit', 12.9560, 79.9360, ST_GeomFromText('POLYGON((79.9350 12.9550, 79.9370 12.9550, 79.9370 12.9570, 79.9350 12.9570, 79.9350 12.9550))', 4326)),
('PCL_TN_105', 'DEMO-TN-000005', 'TN-KCH-CHE-DEMO-105', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '203/1A', 'Patta-505', 10117.00, '2.50 Acres (Punjai)', 'Commercial', 'Logistics Park', 12.9580, 79.9380, ST_GeomFromText('POLYGON((79.9370 12.9570, 79.9390 12.9570, 79.9390 12.9590, 79.9370 12.9590, 79.9370 12.9570))', 4326)),
('PCL_TN_106', 'DEMO-TN-000006', 'TN-KCH-CHE-DEMO-106', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '204/2', 'Patta-506', 14164.00, '3.50 Acres (Nanjai)', 'Agricultural (Nanjai)', 'Sugarcane Plantation', 12.9600, 79.9400, ST_GeomFromText('POLYGON((79.9390 12.9590, 79.9410 12.9590, 79.9410 12.9610, 79.9390 12.9610, 79.9390 12.9590))', 4326)),
('PCL_TN_107', 'DEMO-TN-000007', 'TN-KCH-CHE-DEMO-107', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '205/1B', 'Patta-507', 6070.00, '1.50 Acres (Punjai)', 'Government', 'Primary Health Centre', 12.9620, 79.9420, ST_GeomFromText('POLYGON((79.9410 12.9610, 79.9430 12.9610, 79.9430 12.9630, 79.9410 12.9630, 79.9410 12.9610))', 4326)),
('PCL_TN_108', 'DEMO-TN-000008', 'TN-KCH-CHE-DEMO-108', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '206/3C', 'Patta-508', 24281.00, '6.00 Acres (Nanjai)', 'Agricultural (Nanjai)', 'Paddy Cultivation', 12.9640, 79.9440, ST_GeomFromText('POLYGON((79.9430 12.9630, 79.9450 12.9630, 79.9450 12.9650, 79.9430 12.9650, 79.9430 12.9630))', 4326)),
('PCL_TN_109', 'DEMO-TN-000009', 'TN-KCH-CHE-DEMO-109', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '207/1', 'Patta-509', 18210.00, '4.50 Acres (Punjai)', 'Industrial', 'Electronics Assembly', 12.9660, 79.9460, ST_GeomFromText('POLYGON((79.9450 12.9650, 79.9470 12.9650, 79.9470 12.9670, 79.9450 12.9670, 79.9450 12.9650))', 4326)),
('PCL_TN_110', 'DEMO-TN-000010', 'TN-KCH-CHE-DEMO-110', 'ST_TN', 'DIST_KANCHI', 'LOC_TN_DEMO', '208/2A', 'Patta-510', 30351.00, '7.50 Acres (Nanjai)', 'Agricultural (Nanjai)', 'Organic Horticulture', 12.9680, 79.9480, ST_GeomFromText('POLYGON((79.9470 12.9670, 79.9490 12.9670, 79.9490 12.9690, 79.9470 12.9690, 79.9470 12.9670))', 4326))
ON CONFLICT (id) DO NOTHING;

-- 4. Owners & Ownership Records
INSERT INTO owners (id, full_name, identifier_type, identifier_hash, address, contact_number) VALUES
('OWN_101', 'Demo Owner A', 'Aadhaar Hash', 'a111b222c333...', 'Plot 12, Haveli, Pune, MH', '+91 98220 00001'),
('OWN_102', 'Demo Owner B', 'Aadhaar Hash', 'b222c333d444...', 'No 8, Sriperumbudur, Kanchipuram, TN', '+91 94440 00002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ownership (id, parcel_id, owner_id, ownership_type, share_percentage, acquisition_date) VALUES
('OWN_LNK_101', 'PCL_MH_101', 'OWN_101', 'Sole Owner', 100.00, '2020-01-15'),
('OWN_LNK_102', 'PCL_TN_101', 'OWN_102', 'Sole Owner', 100.00, '2018-05-20')
ON CONFLICT (id) DO NOTHING;

-- 5. RoRs, Registrations, Mutations, Taxes & Utilities for Phase 1 Parcels
INSERT INTO ror_records (id, parcel_id, state_document_type, khata_number, patta_number, tenant_details, encumbrance_notes, land_revenue_tax, raw_source_json, normalized_json, verification_status) VALUES
('ROR_MH_101', 'PCL_MH_101', '7/12 Extract', 'Khata-101', NULL, 'Self Cultivated', 'Nil', 550.00, '{"khatedarName": "Demo Owner A", "surveyNo": "123/4", "areaHectare": "2.45", "jameenPrakar": "Jirayat"}', '{"ownerName": "Demo Owner A", "surveyNumber": "123/4", "areaSqMeters": 24500, "landType": "Agricultural"}', 'SOURCE_VERIFIED'),
('ROR_TN_101', 'PCL_TN_101', 'Patta', NULL, 'Patta-501', 'Owner Cultivation', 'Nil', 420.00, '{"pattaHolder": "Demo Owner B", "surveyNumber": "201/1A", "extent": "4.00 Acres", "classification": "Nanjai"}', '{"ownerName": "Demo Owner B", "surveyNumber": "201/1A", "areaSqMeters": 16187, "landType": "Agricultural (Nanjai)"}', 'SOURCE_VERIFIED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO registrations (id, parcel_id, registration_number, registration_date, transaction_type, seller_name, buyer_name, stamp_duty_paid, sub_registrar_office, document_ref) VALUES
('REG_MH_101', 'PCL_MH_101', 'REG-PUN-2020-0192', '2020-01-10', 'Sale Deed', 'Previous Owner X', 'Demo Owner A', 145000.00, 'SRO Haveli Pune', 'DOC-REG-101'),
('REG_TN_101', 'PCL_TN_101', 'REG-KCH-2018-0841', '2018-05-15', 'Sale Deed', 'Previous Owner Y', 'Demo Owner B', 112000.00, 'SRO Sriperumbudur', 'DOC-REG-501')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mutations (id, parcel_id, mutation_number, registration_id, mutation_type, status, initiated_date, approved_date, approving_officer, remarks) VALUES
('MUT_MH_101', 'PCL_MH_101', 'FERFAR-2020-884', 'REG_MH_101', 'Ownership Transfer', 'APPROVED', '2020-01-15', '2020-02-01', 'Tahsildar Haveli', 'Mutation entry updated in 7/12'),
('MUT_TN_101', 'PCL_TN_101', 'PATTA-TR-2018-402', 'REG_TN_101', 'Patta Transfer', 'APPROVED', '2018-05-20', '2018-06-10', 'Tahsildar Chengalpattu', 'Patta transfer entry approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tax_records (id, parcel_id, assessment_year, tax_amount, amount_paid, due_date, status, receipt_number) VALUES
('TAX_MH_101', 'PCL_MH_101', '2025-2026', 1850.00, 1850.00, '2025-12-31', 'PAID', 'TAX-REC-PUN-101'),
('TAX_TN_101', 'PCL_TN_101', '2025-2026', 1600.00, 1600.00, '2025-11-30', 'PAID', 'TAX-REC-KCH-501')
ON CONFLICT (id) DO NOTHING;

INSERT INTO utility_connections (id, parcel_id, utility_type, consumer_number, provider_name, connection_status, outstanding_dues, last_billed_date) VALUES
('UTL_MH_101', 'PCL_MH_101', 'ELECTRICITY', 'ELE-PUN-1010', 'MSEDCL Pune', 'ACTIVE', 0.00, '2026-02-01'),
('UTL_TN_101', 'PCL_TN_101', 'WATER', 'WTR-KCH-5010', 'Chengalpattu Local Body', 'ACTIVE', 0.00, '2026-02-05')
ON CONFLICT (id) DO NOTHING;
