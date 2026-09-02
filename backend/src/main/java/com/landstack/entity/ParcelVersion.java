package com.landstack.entity;

import java.time.Instant;

public class ParcelVersion {
    private String id;
    private String versionId;
    private String ulpin;
    private Integer versionNumber = 1;
    private String sourceSystem;
    private String sourceVersion;
    private String effectiveFrom = Instant.now().toString();
    private String effectiveTo;
    private String changedFields;
    private String changeReason;
    private String createdAt = Instant.now().toString();
    private String createdBy = "SYSTEM";

    public ParcelVersion() {}

    public ParcelVersion(String id, String versionId, String ulpin, Integer versionNumber, String sourceSystem, String changedFields, String changeReason) {
        this.id = id;
        this.versionId = versionId;
        this.ulpin = ulpin;
        this.versionNumber = versionNumber;
        this.sourceSystem = sourceSystem;
        this.changedFields = changedFields;
        this.changeReason = changeReason;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVersionId() { return versionId; }
    public void setVersionId(String versionId) { this.versionId = versionId; }

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }

    public String getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(String sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getSourceVersion() { return sourceVersion; }
    public void setSourceVersion(String sourceVersion) { this.sourceVersion = sourceVersion; }

    public String getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(String effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public String getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(String effectiveTo) { this.effectiveTo = effectiveTo; }

    public String getChangedFields() { return changedFields; }
    public void setChangedFields(String changedFields) { this.changedFields = changedFields; }

    public String getChangeReason() { return changeReason; }
    public void setChangeReason(String changeReason) { this.changeReason = changeReason; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
