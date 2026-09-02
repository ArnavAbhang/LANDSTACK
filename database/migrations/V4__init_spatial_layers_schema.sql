-- Land Stack Migration V4: Spatial Layers & PostGIS Intelligence Schema

-- 1. Land Use Zones Table
CREATE TABLE IF NOT EXISTS land_use_zones (
    id VARCHAR(50) PRIMARY KEY,
    zone_type VARCHAR(50) NOT NULL, -- Agricultural, Residential, Commercial, Industrial, Forest, Government
    name VARCHAR(100) NOT NULL,
    geometry GEOMETRY(Polygon, 4326),
    source_state VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_land_use_geom ON land_use_zones USING GIST(geometry);

-- 2. Zoning Classification Table
CREATE TABLE IF NOT EXISTS zoning_zones (
    id VARCHAR(50) PRIMARY KEY,
    zone_code VARCHAR(50) NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    max_building_height_meters NUMERIC(5,2),
    fsi_ratio NUMERIC(4,2),
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_zoning_geom ON zoning_zones USING GIST(geometry);

-- 3. Master Plan Reservations Table
CREATE TABLE IF NOT EXISTS master_plan_zones (
    id VARCHAR(50) PRIMARY KEY,
    reservation_type VARCHAR(100) NOT NULL, -- Proposed Road 30m, Green Belt Reservation, Public Facility
    description TEXT,
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_master_plan_geom ON master_plan_zones USING GIST(geometry);

-- 4. Utility Line & Point Networks
CREATE TABLE IF NOT EXISTS utility_networks (
    id VARCHAR(50) PRIMARY KEY,
    utility_type VARCHAR(50) NOT NULL, -- WATER_PIPELINE, POWER_HIGH_TENSION, DRAINAGE
    line_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    geometry GEOMETRY(LineString, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_utility_net_geom ON utility_networks USING GIST(geometry);

-- 5. Road Networks
CREATE TABLE IF NOT EXISTS road_networks (
    id VARCHAR(50) PRIMARY KEY,
    road_name VARCHAR(100) NOT NULL,
    road_type VARCHAR(50) NOT NULL, -- National Highway, State Highway, Village Ring Road
    width_meters NUMERIC(5,2),
    geometry GEOMETRY(LineString, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_road_net_geom ON road_networks USING GIST(geometry);

-- 6. Restriction & Environmental Zones
CREATE TABLE IF NOT EXISTS restriction_zones (
    id VARCHAR(50) PRIMARY KEY,
    restriction_type VARCHAR(100) NOT NULL, -- Flood Zone 100YR, Forest Buffer 100m, Coastal Regulation Zone
    severity VARCHAR(20) NOT NULL,
    geometry GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_restriction_geom ON restriction_zones USING GIST(geometry);

-- 7. Governance Spatial Alerts & Change Detection
CREATE TABLE IF NOT EXISTS spatial_alerts (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- BOUNDARY_OVERLAP, LAND_USE_MISMATCH, PLANNING_RESERVATION
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL,
    details TEXT NOT NULL,
    affected_parcel_id VARCHAR(50),
    overlap_sq_meters NUMERIC(10,2),
    status VARCHAR(30) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS change_detection_results (
    id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- SATELLITE_SENTINEL2, DRONE_ORTHOMOSAIC
    change_type VARCHAR(50) NOT NULL, -- NEW_CONSTRUCTION, VEGETATION_CLEARANCE, BOUNDARY_SHIFT
    confidence NUMERIC(4,3) NOT NULL, -- e.g. 0.945
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'UNVERIFIED'
);
