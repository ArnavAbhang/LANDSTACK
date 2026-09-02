package com.landstack.entity;

import java.time.Instant;

public class IntegrationJob {
    private String id;
    private String jobId;
    private String sourceId;
    private String jobType; // GEOJSON_IMPORT, FULL_SYNC, CRS_TRANSFORM, GEOMETRY_REPAIR, SATELLITE_ANALYSIS
    private String startedAt = Instant.now().toString();
    private String completedAt;
    private String status = "COMPLETED"; // QUEUED, RUNNING, COMPLETED, COMPLETED_WITH_WARNINGS, FAILED, CANCELLED
    private Integer recordsReceived = 0;
    private Integer recordsProcessed = 0;
    private Integer recordsSucceeded = 0;
    private Integer recordsFailed = 0;
    private Integer warnings = 0;
    private String errorMessage;

    public IntegrationJob() {}

    public IntegrationJob(String id, String jobId, String sourceId, String jobType, Integer recReceived, Integer recSucceeded, Integer warnings) {
        this.id = id;
        this.jobId = jobId;
        this.sourceId = sourceId;
        this.jobType = jobType;
        this.recordsReceived = recReceived;
        this.recordsProcessed = recReceived;
        this.recordsSucceeded = recSucceeded;
        this.recordsFailed = recReceived - recSucceeded;
        this.warnings = warnings;
        this.completedAt = Instant.now().toString();
        this.status = warnings > 0 ? "COMPLETED_WITH_WARNINGS" : "COMPLETED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRecordsReceived() { return recordsReceived; }
    public void setRecordsReceived(Integer recordsReceived) { this.recordsReceived = recordsReceived; }

    public Integer getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(Integer recordsProcessed) { this.recordsProcessed = recordsProcessed; }

    public Integer getRecordsSucceeded() { return recordsSucceeded; }
    public void setRecordsSucceeded(Integer recordsSucceeded) { this.recordsSucceeded = recordsSucceeded; }

    public Integer getRecordsFailed() { return recordsFailed; }
    public void setRecordsFailed(Integer recordsFailed) { this.recordsFailed = recordsFailed; }

    public Integer getWarnings() { return warnings; }
    public void setWarnings(Integer warnings) { this.warnings = warnings; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
