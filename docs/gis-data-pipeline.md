# LAND STACK — Phase 9 GIS Data Import & Geometry Validation Pipeline

## 1. GeoJSON Import Wizard Flow
1. **Source Selection**: Choose external source and protocol.
2. **GeoJSON Payload Ingestion**: Upload file or paste raw GeoJSON feature collection.
3. **CRS Detection & Transformation**: Detect source CRS (`EPSG:4326`, `EPSG:3857`, `EPSG:32643`) and apply PostGIS `ST_Transform` to canonical WGS84 (`EPSG:4326`).
4. **PostGIS Geometry Validation**: Check polygon closure, self-intersections (`ST_IsValid`, `ST_IsValidReason`, `ST_MakeValid`).
5. **Cadastral Boundary Preservation**: Retain complex irregular polygon geometries without simplifying into generic squares.
6. **Data Quality Report**: Generate score and metrics (`recordsReceived`, `validRecords`, `warningRecords`, `rejectedRecords`, `duplicateRecords`).
7. **PostGIS Commit & SHA-256 Audit Log**: Commit valid features to database under canonical ULPIN keys and create chained audit record.
