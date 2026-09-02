package com.landstack.entity;

import java.time.Instant;

public class WorkflowCase {
    private String caseId;
    private String requestId;
    private String currentStage = "SUBMITTED";
    private String currentOfficer;
    private String department;
    private String priority = "NORMAL";
    private String slaDeadline = Instant.now().plusSeconds(259200).toString(); // 72 hours default
    private Integer escalationLevel = 0;
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();
    private String closedAt;

    public WorkflowCase() {}

    public WorkflowCase(String caseId, String requestId, String currentStage, String department) {
        this.caseId = caseId;
        this.requestId = requestId;
        this.currentStage = currentStage;
        this.department = department;
    }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

    public String getCurrentOfficer() { return currentOfficer; }
    public void setCurrentOfficer(String currentOfficer) { this.currentOfficer = currentOfficer; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(String slaDeadline) { this.slaDeadline = slaDeadline; }

    public Integer getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(Integer escalationLevel) { this.escalationLevel = escalationLevel; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getClosedAt() { return closedAt; }
    public void setClosedAt(String closedAt) { this.closedAt = closedAt; }
}
