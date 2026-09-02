-- Land Stack Migration V17: GIS Dataset Registry Table

CREATE TABLE IF NOT EXISTS gis_datasets (
    id VARCHAR(50) PRIMARY KEY,
    dataset_id VARCHAR(50) UNIQUE NOT NULL,
    dataset_name VARCHAR(150) NOT NULL,
    source_id VARCHAR(50) REFERENCES external_data_sources(source_id) ON DELETE CASCADE,
    state_code VARCHAR(10) NOT NULL,
    district_id VARCHAR(50),
    village_id VARCHAR(50),
    dataset_type VARCHAR(50) NOT NULL, -- CADASTRAL, LAND_USE, ZONING, MASTER_PLAN, ROAD, UTILITY, RESTRICTION, OTHER
    feature_count INT DEFAULT 0,
    source_crs VARCHAR(30) DEFAULT 'EPSG:4326',
    target_crs VARCHAR(30) DEFAULT 'EPSG:4326',
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(20) DEFAULT '1.0.0',
    status VARCHAR(30) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_gis_ds_state ON gis_datasets(state_code);
CREATE INDEX IF NOT EXISTS idx_gis_ds_type ON gis_datasets(dataset_type);
