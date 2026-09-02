-- Land Stack Migration V19: Satellite Imagery Metadata Table

CREATE TABLE IF NOT EXISTS satellite_sources (
    id VARCHAR(50) PRIMARY KEY,
    source_id VARCHAR(50) UNIQUE NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    tile_type VARCHAR(30) DEFAULT 'XYZ', -- XYZ, WMS, WMTS
    endpoint_template VARCHAR(255) NOT NULL,
    attribution VARCHAR(255),
    min_zoom INT DEFAULT 0,
    max_zoom INT DEFAULT 22,
    status VARCHAR(30) DEFAULT 'AVAILABLE', -- CONNECTED, AVAILABLE, READY, SIMULATED, OFFLINE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sat_src_provider ON satellite_sources(provider_name);
