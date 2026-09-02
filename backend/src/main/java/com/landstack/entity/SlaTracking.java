package com.landstack.entity;

import java.time.Instant;

public class SlaTracking {
    private String slaId;
    private String caseId;
    private Integer targetHours = 72;
    private String deadline = Instant.now().plusSeconds(259200).toString();
    private Integer elapsedHours = 0;
    private Integer remainingHours = 72;
    private String slaStatus = "ON_TRACK"; // ON_TRACK, AT_RISK, BREACHED, COMPLETED
    private Integer escalationLevel = 0;
    private String createdAt = Instant.now().toString();

    public SlaTracking() {}

    public SlaTracking(String slaId, String caseId, Integer targetHours, String deadline, String slaStatus) {
        this.slaId = slaId;
        this.caseId = caseId;
        this.targetHours = targetHours;
        this.deadline = deadline;
        this.remainingHours = targetHours;
        this.slaStatus = slaStatus;
    }

    public String getSlaId() { return slaId; }
    public void setSlaId(String slaId) { this.slaId = slaId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public Integer getTargetHours() { return targetHours; }
    public void setTargetHours(Integer targetHours) { this.targetHours = targetHours; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public Integer getElapsedHours() { return elapsedHours; }
    public void setElapsedHours(Integer elapsedHours) { this.elapsedHours = elapsedHours; }

    public Integer getRemainingHours() { return remainingHours; }
    public void setRemainingHours(Integer remainingHours) { this.remainingHours = remainingHours; }

    public String getSlaStatus() { return slaStatus; }
    public void setSlaStatus(String slaStatus) { this.slaStatus = slaStatus; }

    public Integer getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(Integer escalationLevel) { this.escalationLevel = escalationLevel; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
