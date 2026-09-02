-- Land Stack Seed Data V5 (Phase 2 Spatial Layers & Intelligence)

-- 1. Land Use Zones
INSERT INTO land_use_zones (id, zone_type, name, geometry, source_state) VALUES
('LU_MH_AGRI', 'Agricultural', 'Haveli Agricultural Sector', ST_GeomFromText('POLYGON((73.8480 18.5180, 73.8600 18.5180, 73.8600 18.5300, 73.8480 18.5300, 73.8480 18.5180))', 4326), 'ST_MH'),
('LU_MH_RES', 'Residential', 'Haveli Suburban Expansion', ST_GeomFromText('POLYGON((73.8600 18.5300, 73.8720 18.5300, 73.8720 18.5420, 73.8600 18.5420, 73.8600 18.5300))', 4326), 'ST_MH'),
('LU_TN_AGRI', 'Agricultural', 'Sriperumbudur Nanjai Paddy Zone', ST_GeomFromText('POLYGON((79.9280 12.9480, 79.9400 12.9480, 79.9400 12.9600, 79.9280 12.9600, 79.9280 12.9480))', 4326), 'ST_TN'),
('LU_TN_IND', 'Industrial', 'SIPCOT Industrial Corridor', ST_GeomFromText('POLYGON((79.9400 12.9600, 79.9520 12.9600, 79.9520 12.9720, 79.9400 12.9720, 79.9400 12.9600))', 4326), 'ST_TN')
ON CONFLICT (id) DO NOTHING;

-- 2. Zoning Classification
INSERT INTO zoning_zones (id, zone_code, zone_name, max_building_height_meters, fsi_ratio, geometry) VALUES
('ZON_R1', 'R1-RES', 'Primary Residential Zone R1', 15.0, 1.5, ST_GeomFromText('POLYGON((73.8520 18.5220, 73.8580 18.5220, 73.8580 18.5280, 73.8520 18.5280, 73.8520 18.5220))', 4326)),
('ZON_AG', 'AG-GEN', 'General Agricultural Zone', 6.0, 0.2, ST_GeomFromText('POLYGON((73.8480 18.5180, 73.8520 18.5180, 73.8520 18.5220, 73.8480 18.5220, 73.8480 18.5180))', 4326))
ON CONFLICT (id) DO NOTHING;

-- 3. Master Plan Reservations
INSERT INTO master_plan_zones (id, reservation_type, description, geometry) VALUES
('MP_ROAD_30M', 'Proposed 30m Ring Road', 'PMRDA Master Plan 2030 Ring Road Alignment', ST_GeomFromText('POLYGON((73.8500 18.5230, 73.8650 18.5230, 73.8650 18.5240, 73.8500 18.5240, 73.8500 18.5230))', 4326))
ON CONFLICT (id) DO NOTHING;

-- 4. Utility Line Networks
INSERT INTO utility_networks (id, utility_type, line_name, status, geometry) VALUES
('UTL_WTR_LINE1', 'WATER_PIPELINE', 'Main Haveli Feeder Line 400mm', 'ACTIVE', ST_GeomFromText('LINESTRING(73.8490 18.5200, 73.8550 18.5250, 73.8650 18.5300)', 4326)),
('UTL_PWR_LINE1', 'POWER_HIGH_TENSION', 'MSEDCL 33kV Feeder Line', 'ACTIVE', ST_GeomFromText('LINESTRING(73.8500 18.5190, 73.8560 18.5240, 73.8660 18.5310)', 4326))
ON CONFLICT (id) DO NOTHING;

-- 5. Road Networks
INSERT INTO road_networks (id, road_name, road_type, width_meters, geometry) VALUES
('RD_NH4', 'Pune-Paud State Highway 130', 'State Highway', 24.0, ST_GeomFromText('LINESTRING(73.8480 18.5180, 73.8580 18.5280, 73.8680 18.5380)', 4326))
ON CONFLICT (id) DO NOTHING;

-- 6. Restriction & Environmental Zones
INSERT INTO restriction_zones (id, restriction_type, severity, geometry) VALUES
('RSTR_FLOOD_100', 'Mutha River 100-Year Flood Zone', 'HIGH', ST_GeomFromText('POLYGON((73.8530 18.5320, 73.8570 18.5320, 73.8570 18.5350, 73.8530 18.5350, 73.8530 18.5320))', 4326))
ON CONFLICT (id) DO NOTHING;

-- 7. Spatial Alerts & Change Detection
INSERT INTO spatial_alerts (id, parcel_id, alert_type, severity, title, details, affected_parcel_id, overlap_sq_meters, status) VALUES
(
    'SP_ALT_01', 'PCL_MH_102', 'BOUNDARY_OVERLAP', 'HIGH', 'Potential Spatial Boundary Conflict',
    'Parcel MH-PUN-HAV-DEMO-102 overlaps Parcel MH-PUN-HAV-DEMO-103 by 130 m² along northern fence boundary.',
    'PCL_MH_103', 130.00, 'OPEN'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO change_detection_results (id, parcel_id, source_type, change_type, confidence, status) VALUES
(
    'CHG_01', 'PCL_MH_102', 'DRONE_ORTHOMOSAIC', 'NEW_CONSTRUCTION', 0.945, 'UNVERIFIED'
)
ON CONFLICT (id) DO NOTHING;
