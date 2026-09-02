-- Land Stack Migration V16: Integration Jobs Table

CREATE TABLE IF NOT EXISTS integration_jobs (
    id VARCHAR(50) PRIMARY KEY,
    job_id VARCHAR(50) UNIQUE NOT NULL,
    source_id VARCHAR(50) REFERENCES external_data_sources(source_id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- GEOJSON_IMPORT, FULL_SYNC, CRS_TRANSFORM, GEOMETRY_REPAIR, SATELLITE_ANALYSIS
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'RUNNING', -- QUEUED, RUNNING, COMPLETED, COMPLETED_WITH_WARNINGS, FAILED, CANCELLED
    records_received INT DEFAULT 0,
    records_processed INT DEFAULT 0,
    records_succeeded INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    warnings INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_int_jobs_source ON integration_jobs(source_id);
CREATE INDEX IF NOT EXISTS idx_int_jobs_status ON integration_jobs(status);
