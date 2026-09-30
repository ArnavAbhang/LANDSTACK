-- Migration V31: PostGIS Cadastral Geometry Foundation & Realistic Cadastral Fabric
-- 36 Contiguous Irregular Cadastral Polygons for Paud Village (Pune, Maharashtra)
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE parcels ALTER COLUMN geometry TYPE GEOMETRY(Geometry, 4326);
CREATE INDEX IF NOT EXISTS idx_parcels_gist_geometry ON parcels USING GIST(geometry);

INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_001', 'MH-27-PUN-000001', 'MH-PUN-HAV-PAUD-123_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '123/4', 'Plot-01', 24500.0, '2.45 Hectares',
    'Agricultural', 'Crop Cultivation', 18.525875, 73.845975,
    ST_GeomFromText('POLYGON((73.845 18.525, 73.8472 18.525, 73.8467 18.5265, 73.845 18.527, 73.845 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_002', 'MH-27-PUN-000002', 'MH-PUN-HAV-PAUD-124_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '124/2', 'Plot-02', 18200.0, '1.82 Hectares',
    'Agricultural', 'Horticulture', 18.525875, 73.848287,
    ST_GeomFromText('POLYGON((73.8472 18.525, 73.8495 18.525, 73.84975 18.527, 73.8467 18.5265, 73.8472 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_003', 'MH-27-PUN-000003', 'MH-PUN-HAV-PAUD-125_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '125/1', 'Plot-03', 31000.0, '3.10 Hectares',
    'Agricultural', 'Crop Cultivation', 18.526125, 73.85065,
    ST_GeomFromText('POLYGON((73.8495 18.525, 73.8518 18.525, 73.85155 18.5275, 73.84975 18.527, 73.8495 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_004', 'MH-27-PUN-000004', 'MH-PUN-HAV-PAUD-126_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '126/3', 'Plot-04', 13600.0, '1.36 Hectares',
    'Residential', 'Housing Layout', 18.526062, 73.852963,
    ST_GeomFromText('POLYGON((73.8518 18.525, 73.854 18.525, 73.8545 18.52675, 73.85155 18.5275, 73.8518 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_005', 'MH-27-PUN-000005', 'MH-PUN-HAV-PAUD-127_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '127/2', 'Plot-05', 42000.0, '4.20 Hectares',
    'Agricultural', 'Sugarcane Crop', 18.526, 73.855225,
    ST_GeomFromText('POLYGON((73.854 18.525, 73.8562 18.525, 73.8562 18.52725, 73.8545 18.52675, 73.854 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_006', 'MH-27-PUN-000006', 'MH-PUN-HAV-PAUD-128_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '128/1', 'Plot-06', 21800.0, '2.18 Hectares',
    'Residential', 'Residential Plot', 18.526062, 73.85735,
    ST_GeomFromText('POLYGON((73.8562 18.525, 73.8585 18.525, 73.8585 18.527, 73.8562 18.52725, 73.8562 18.525))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_007', 'MH-27-PUN-000007', 'MH-PUN-HAV-PAUD-129_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '129/4', 'Plot-07', 17400.0, '1.74 Hectares',
    'Commercial', 'Warehouse', 18.528037, 73.845975,
    ST_GeomFromText('POLYGON((73.845 18.527, 73.8467 18.5265, 73.8472 18.52945, 73.845 18.5292, 73.845 18.527))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_008', 'MH-27-PUN-000008', 'MH-PUN-HAV-PAUD-130_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '130/2', 'Plot-08', 36500.0, '3.65 Hectares',
    'Agricultural', 'Crop Cultivation', 18.527912, 73.848163,
    ST_GeomFromText('POLYGON((73.8467 18.5265, 73.84975 18.527, 73.849 18.5287, 73.8472 18.52945, 73.8467 18.5265))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_009', 'MH-27-PUN-000009', 'MH-PUN-HAV-PAUD-131_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '131/1', 'Plot-09', 20500.0, '2.05 Hectares',
    'Residential', 'Residential Plot', 18.5281, 73.850588,
    ST_GeomFromText('POLYGON((73.84975 18.527, 73.85155 18.5275, 73.85205 18.5292, 73.849 18.5287, 73.84975 18.527))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_010', 'MH-27-PUN-000010', 'MH-PUN-HAV-PAUD-132_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '132/3', 'Plot-10', 29200.0, '2.92 Hectares',
    'Agricultural', 'Orchard', 18.528287, 73.852963,
    ST_GeomFromText('POLYGON((73.85155 18.5275, 73.8545 18.52675, 73.85375 18.5297, 73.85205 18.5292, 73.85155 18.5275))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_011', 'MH-27-PUN-000011', 'MH-PUN-HAV-PAUD-143_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '143/4', 'Plot-11', 29000.0, '2.90 Hectares',
    'Agricultural', 'Crop Cultivation', 18.528163, 73.855288,
    ST_GeomFromText('POLYGON((73.8545 18.52675, 73.8562 18.52725, 73.8567 18.52895, 73.85375 18.5297, 73.8545 18.52675))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_012', 'MH-27-PUN-000012', 'MH-PUN-HAV-PAUD-144_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '144/1', 'Plot-12', 36000.0, '3.60 Hectares',
    'Residential', 'Housing Plot', 18.5281, 73.857475,
    ST_GeomFromText('POLYGON((73.8562 18.52725, 73.8585 18.527, 73.8585 18.5292, 73.8567 18.52895, 73.8562 18.52725))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_013', 'MH-27-PUN-000013', 'MH-PUN-HAV-PAUD-145_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '145/2', 'Plot-13', 13000.0, '1.30 Hectares',
    'Agricultural', 'Crop Cultivation', 18.53035, 73.846225,
    ST_GeomFromText('POLYGON((73.845 18.5292, 73.8472 18.52945, 73.8477 18.53125, 73.845 18.5315, 73.845 18.5292))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_014', 'MH-27-PUN-000014', 'MH-PUN-HAV-PAUD-146_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '146/3', 'Plot-14', 20000.0, '2.00 Hectares',
    'Agricultural', 'Crop Cultivation', 18.530288, 73.84835,
    ST_GeomFromText('POLYGON((73.8472 18.52945, 73.849 18.5287, 73.8495 18.53175, 73.8477 18.53125, 73.8472 18.52945))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_015', 'MH-27-PUN-000015', 'MH-PUN-HAV-PAUD-147_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '147/4', 'Plot-15', 27000.0, '2.70 Hectares',
    'Commercial', 'Retail Store', 18.530162, 73.850462,
    ST_GeomFromText('POLYGON((73.849 18.5287, 73.85205 18.5292, 73.8513 18.531, 73.8495 18.53175, 73.849 18.5287))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_016', 'MH-27-PUN-000016', 'MH-PUN-HAV-PAUD-148_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '148/1', 'Plot-16', 34000.0, '3.40 Hectares',
    'Agricultural', 'Crop Cultivation', 18.53035, 73.852837,
    ST_GeomFromText('POLYGON((73.85205 18.5292, 73.85375 18.5297, 73.85425 18.5315, 73.8513 18.531, 73.85205 18.5292))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_017', 'MH-27-PUN-000017', 'MH-PUN-HAV-PAUD-149_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '149/2', 'Plot-17', 41000.0, '4.10 Hectares',
    'Agricultural', 'Crop Cultivation', 18.530538, 73.855163,
    ST_GeomFromText('POLYGON((73.85375 18.5297, 73.8567 18.52895, 73.85595 18.532, 73.85425 18.5315, 73.85375 18.5297))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_018', 'MH-27-PUN-000018', 'MH-PUN-HAV-PAUD-150_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '150/3', 'Plot-18', 18000.0, '1.80 Hectares',
    'Residential', 'Housing Plot', 18.530413, 73.857413,
    ST_GeomFromText('POLYGON((73.8567 18.52895, 73.8585 18.5292, 73.8585 18.5315, 73.85595 18.532, 73.8567 18.52895))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_019', 'MH-27-PUN-000019', 'MH-PUN-HAV-PAUD-151_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '151/4', 'Plot-19', 25000.0, '2.50 Hectares',
    'Agricultural', 'Crop Cultivation', 18.532713, 73.846162,
    ST_GeomFromText('POLYGON((73.845 18.5315, 73.8477 18.53125, 73.84695 18.5343, 73.845 18.5338, 73.845 18.5315))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_020', 'MH-27-PUN-000020', 'MH-PUN-HAV-PAUD-152_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '152/1', 'Plot-20', 32000.0, '3.20 Hectares',
    'Agricultural', 'Crop Cultivation', 18.532713, 73.848538,
    ST_GeomFromText('POLYGON((73.8477 18.53125, 73.8495 18.53175, 73.85 18.53355, 73.84695 18.5343, 73.8477 18.53125))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_021', 'MH-27-PUN-000021', 'MH-PUN-HAV-PAUD-153_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '153/2', 'Plot-21', 39000.0, '3.90 Hectares',
    'Commercial', 'Retail Store', 18.532587, 73.85065,
    ST_GeomFromText('POLYGON((73.8495 18.53175, 73.8513 18.531, 73.8518 18.53405, 73.85 18.53355, 73.8495 18.53175))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_022', 'MH-27-PUN-000022', 'MH-PUN-HAV-PAUD-154_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '154/3', 'Plot-22', 16000.0, '1.60 Hectares',
    'Agricultural', 'Crop Cultivation', 18.532463, 73.852712,
    ST_GeomFromText('POLYGON((73.8513 18.531, 73.85425 18.5315, 73.8535 18.5333, 73.8518 18.53405, 73.8513 18.531))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_023', 'MH-27-PUN-000023', 'MH-PUN-HAV-PAUD-155_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '155/4', 'Plot-23', 23000.0, '2.30 Hectares',
    'Agricultural', 'Crop Cultivation', 18.53265, 73.855037,
    ST_GeomFromText('POLYGON((73.85425 18.5315, 73.85595 18.532, 73.85645 18.5338, 73.8535 18.5333, 73.85425 18.5315))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_024', 'MH-27-PUN-000024', 'MH-PUN-HAV-PAUD-156_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '156/1', 'Plot-24', 30000.0, '3.00 Hectares',
    'Residential', 'Housing Plot', 18.532775, 73.85735,
    ST_GeomFromText('POLYGON((73.85595 18.532, 73.8585 18.5315, 73.8585 18.5338, 73.85645 18.5338, 73.85595 18.532))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_025', 'MH-27-PUN-000025', 'MH-PUN-HAV-PAUD-157_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '157/2', 'Plot-25', 37000.0, '3.70 Hectares',
    'Agricultural', 'Crop Cultivation', 18.535025, 73.8461,
    ST_GeomFromText('POLYGON((73.845 18.5338, 73.84695 18.5343, 73.84745 18.536, 73.845 18.536, 73.845 18.5338))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_026', 'MH-27-PUN-000026', 'MH-PUN-HAV-PAUD-158_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '158/3', 'Plot-26', 14000.0, '1.40 Hectares',
    'Agricultural', 'Crop Cultivation', 18.535088, 73.848412,
    ST_GeomFromText('POLYGON((73.84695 18.5343, 73.85 18.53355, 73.84925 18.5365, 73.84745 18.536, 73.84695 18.5343))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_027', 'MH-27-PUN-000027', 'MH-PUN-HAV-PAUD-159_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '159/4', 'Plot-27', 21000.0, '2.10 Hectares',
    'Commercial', 'Retail Store', 18.534962, 73.850837,
    ST_GeomFromText('POLYGON((73.85 18.53355, 73.8518 18.53405, 73.8523 18.53575, 73.84925 18.5365, 73.85 18.53355))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_028', 'MH-27-PUN-000028', 'MH-PUN-HAV-PAUD-160_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '160/1', 'Plot-28', 28000.0, '2.80 Hectares',
    'Agricultural', 'Crop Cultivation', 18.534838, 73.8529,
    ST_GeomFromText('POLYGON((73.8518 18.53405, 73.8535 18.5333, 73.854 18.53625, 73.8523 18.53575, 73.8518 18.53405))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_029', 'MH-27-PUN-000029', 'MH-PUN-HAV-PAUD-161_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '161/2', 'Plot-29', 35000.0, '3.50 Hectares',
    'Agricultural', 'Crop Cultivation', 18.534712, 73.854912,
    ST_GeomFromText('POLYGON((73.8535 18.5333, 73.85645 18.5338, 73.8557 18.5355, 73.854 18.53625, 73.8535 18.5333))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_030', 'MH-27-PUN-000030', 'MH-PUN-HAV-PAUD-162_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '162/3', 'Plot-30', 12000.0, '1.20 Hectares',
    'Residential', 'Housing Plot', 18.534775, 73.857287,
    ST_GeomFromText('POLYGON((73.85645 18.5338, 73.8585 18.5338, 73.8585 18.536, 73.8557 18.5355, 73.85645 18.5338))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_031', 'MH-27-PUN-000031', 'MH-PUN-HAV-PAUD-163_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '163/4', 'Plot-31', 19000.0, '1.90 Hectares',
    'Agricultural', 'Crop Cultivation', 18.5371, 73.846162,
    ST_GeomFromText('POLYGON((73.845 18.536, 73.84745 18.536, 73.8472 18.5382, 73.845 18.5382, 73.845 18.536))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_032', 'MH-27-PUN-000032', 'MH-PUN-HAV-PAUD-164_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '164/1', 'Plot-32', 26000.0, '2.60 Hectares',
    'Agricultural', 'Crop Cultivation', 18.537225, 73.84835,
    ST_GeomFromText('POLYGON((73.84745 18.536, 73.84925 18.5365, 73.8495 18.5382, 73.8472 18.5382, 73.84745 18.536))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_033', 'MH-27-PUN-000033', 'MH-PUN-HAV-PAUD-165_2', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '165/2', 'Plot-33', 33000.0, '3.30 Hectares',
    'Commercial', 'Retail Store', 18.537163, 73.850713,
    ST_GeomFromText('POLYGON((73.84925 18.5365, 73.8523 18.53575, 73.8518 18.5382, 73.8495 18.5382, 73.84925 18.5365))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_034', 'MH-27-PUN-000034', 'MH-PUN-HAV-PAUD-166_3', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '166/3', 'Plot-34', 40000.0, '4.00 Hectares',
    'Agricultural', 'Crop Cultivation', 18.5371, 73.853025,
    ST_GeomFromText('POLYGON((73.8523 18.53575, 73.854 18.53625, 73.854 18.5382, 73.8518 18.5382, 73.8523 18.53575))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_035', 'MH-27-PUN-000035', 'MH-PUN-HAV-PAUD-167_4', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '167/4', 'Plot-35', 17000.0, '1.70 Hectares',
    'Agricultural', 'Crop Cultivation', 18.537038, 73.854975,
    ST_GeomFromText('POLYGON((73.854 18.53625, 73.8557 18.5355, 73.8562 18.5382, 73.854 18.5382, 73.854 18.53625))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;
INSERT INTO parcels (
    id, ulpin, state_parcel_id, state_id, district_id, locality_id,
    survey_number, plot_number, area_sq_meters, area_display,
    land_type, land_use, latitude, longitude, geometry, status
) VALUES (
    'PCL_MH_036', 'MH-27-PUN-000036', 'MH-PUN-HAV-PAUD-168_1', 'ST_MH', 'DIST_PUNE', 'LOC_PAUD',
    '168/1', 'Plot-36', 24000.0, '2.40 Hectares',
    'Residential', 'Housing Plot', 18.536975, 73.857225,
    ST_GeomFromText('POLYGON((73.8557 18.5355, 73.8585 18.536, 73.8585 18.5382, 73.8562 18.5382, 73.8557 18.5355))', 4326), 'ACTIVE'
) ON CONFLICT (id) DO UPDATE SET
    ulpin = EXCLUDED.ulpin,
    survey_number = EXCLUDED.survey_number,
    area_sq_meters = EXCLUDED.area_sq_meters,
    area_display = EXCLUDED.area_display,
    land_type = EXCLUDED.land_type,
    land_use = EXCLUDED.land_use,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    geometry = EXCLUDED.geometry;

-- Add Village Boundary and Road Network Layers for Paud
CREATE TABLE IF NOT EXISTS gis_layers (
    id VARCHAR(50) PRIMARY KEY,
    layer_name VARCHAR(50) NOT NULL,
    state_id VARCHAR(50),
    locality_id VARCHAR(50),
    feature_name VARCHAR(150) NOT NULL,
    category VARCHAR(50),
    color VARCHAR(20),
    geometry GEOMETRY(Geometry, 4326)
);
CREATE INDEX IF NOT EXISTS idx_gis_layers_geometry ON gis_layers USING GIST(geometry);

INSERT INTO gis_layers (id, layer_name, state_id, locality_id, feature_name, category, color, geometry) VALUES
('VIL_BD_PAUD', 'villageBoundary', 'ST_MH', 'LOC_PAUD', 'Paud Revenue Village Boundary', 'Administrative Boundary', '#3b82f6', ST_GeomFromText('POLYGON((73.8445 18.5245, 73.8590 18.5245, 73.8590 18.5387, 73.8445 18.5387, 73.8445 18.5245))', 4326)),
('RD_PAUD_MAIN', 'roads', 'ST_MH', 'LOC_PAUD', 'Paud Main Arterial Highway (NH-753F)', 'Highway Network', '#64748b', ST_GeomFromText('LINESTRING(73.8450 18.5315, 73.8495 18.5315, 73.8540 18.5315, 73.8585 18.5315)', 4326))
ON CONFLICT (id) DO NOTHING;