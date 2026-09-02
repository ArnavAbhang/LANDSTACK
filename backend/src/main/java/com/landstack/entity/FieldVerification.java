package com.landstack.entity;

import java.time.Instant;

public class FieldVerification {
    private String verificationId;
    private String caseId;
    private String ulpin;
    private String assignedOfficer;
    private String scheduledDate = Instant.now().plusSeconds(86400).toString(); // 24h
    private Double latitude = 18.5350;
    private Double longitude = 73.8550;
    private String observations;
    private String verificationStatus = "PENDING"; // PENDING, SCHEDULED, IN_PROGRESS, VERIFIED, FAILED, CANCELLED
    private String evidenceReference;
    private String createdAt = Instant.now().toString();

    public FieldVerification() {}

    public FieldVerification(String verificationId, String caseId, String ulpin, String assignedOfficer, String observations) {
        this.verificationId = verificationId;
        this.caseId = caseId;
        this.ulpin = ulpin;
        this.assignedOfficer = assignedOfficer;
        this.observations = observations;
    }

    public String getVerificationId() { return verificationId; }
    public void setVerificationId(String verificationId) { this.verificationId = verificationId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getEvidenceReference() { return evidenceReference; }
    public void setEvidenceReference(String evidenceReference) { this.evidenceReference = evidenceReference; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
