package com.landstack.entity;

import java.time.Instant;

public class GisDataset {
    private String id;
    private String datasetId;
    private String datasetName;
    private String sourceId;
    private String stateCode;
    private String districtId;
    private String villageId;
    private String datasetType; // CADASTRAL, LAND_USE, ZONING, MASTER_PLAN, ROAD, UTILITY, RESTRICTION, OTHER
    private Integer featureCount = 0;
    private String sourceCrs = "EPSG:4326";
    private String targetCrs = "EPSG:4326";
    private String importedAt = Instant.now().toString();
    private String version = "1.0.0";
    private String status = "ACTIVE";

    public GisDataset() {}

    public GisDataset(String id, String datasetId, String datasetName, String sourceId, String stateCode, String datasetType, Integer featureCount) {
        this.id = id;
        this.datasetId = datasetId;
        this.datasetName = datasetName;
        this.sourceId = sourceId;
        this.stateCode = stateCode;
        this.datasetType = datasetType;
        this.featureCount = featureCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDatasetId() { return datasetId; }
    public void setDatasetId(String datasetId) { this.datasetId = datasetId; }

    public String getDatasetName() { return datasetName; }
    public void setDatasetName(String datasetName) { this.datasetName = datasetName; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getVillageId() { return villageId; }
    public void setVillageId(String villageId) { this.villageId = villageId; }

    public String getDatasetType() { return datasetType; }
    public void setDatasetType(String datasetType) { this.datasetType = datasetType; }

    public Integer getFeatureCount() { return featureCount; }
    public void setFeatureCount(Integer featureCount) { this.featureCount = featureCount; }

    public String getSourceCrs() { return sourceCrs; }
    public void setSourceCrs(String sourceCrs) { this.sourceCrs = sourceCrs; }

    public String getTargetCrs() { return targetCrs; }
    public void setTargetCrs(String targetCrs) { this.targetCrs = targetCrs; }

    public String getImportedAt() { return importedAt; }
    public void setImportedAt(String importedAt) { this.importedAt = importedAt; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
