-- Land Stack Migration V29: PostGIS GiST Spatial Indexes

-- PostGIS GiST spatial index for spatial bounding box and ST_Intersects queries
CREATE INDEX IF NOT EXISTS idx_parcels_geometry_gist ON parcels USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_spatial_layers_geom_gist ON spatial_layers USING GIST (geometry);

COMMENT ON INDEX idx_parcels_geometry_gist IS 'PostGIS GiST spatial index enabling fast viewport bounding box & spatial intersection queries';
