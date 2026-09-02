package com.landstack.entity;

import java.time.Instant;

public class ExternalDataSource {
    private String id;
    private String sourceId;
    private String sourceName;
    private String stateCode;
    private String department;
    private String sourceType; // LAND_RECORDS, CADASTRAL_GIS, REGISTRATION, PROPERTY_TAX, ZONING, MASTER_PLAN, UTILITY, SATELLITE, OTHER
    private String protocol; // REST, WMS, WFS, WMTS, GEOJSON, CSV, SHAPEFILE, POSTGIS, FILE_UPLOAD
    private String endpoint;
    private String authenticationType = "NONE"; // NONE, API_KEY, OAUTH2, BASIC, CERTIFICATE, INTERNAL, PROTOTYPE
    private String schemaVersion = "1.0.0";
    private String status = "READY"; // CONNECTED, AVAILABLE, READY, SIMULATED, OFFLINE
    private String lastSyncAt;
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();

    public ExternalDataSource() {}

    public ExternalDataSource(String id, String sourceId, String sourceName, String stateCode, String department, String sourceType, String protocol, String status) {
        this.id = id;
        this.sourceId = sourceId;
        this.sourceName = sourceName;
        this.stateCode = stateCode;
        this.department = department;
        this.sourceType = sourceType;
        this.protocol = protocol;
        this.status = status;
        this.lastSyncAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public String getAuthenticationType() { return authenticationType; }
    public void setAuthenticationType(String authenticationType) { this.authenticationType = authenticationType; }

    public String getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(String schemaVersion) { this.schemaVersion = schemaVersion; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastSyncAt() { return lastSyncAt; }
    public void setLastSyncAt(String lastSyncAt) { this.lastSyncAt = lastSyncAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
