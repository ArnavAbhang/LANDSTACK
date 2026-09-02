package com.landstack.entity;

import java.time.Instant;

public class CaseAssignment {
    private String assignmentId;
    private String caseId;
    private String officerId;
    private String department;
    private String assignedAt = Instant.now().toString();
    private String acceptedAt;
    private String completedAt;
    private String assignmentStatus = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, COMPLETED, REASSIGNED
    private String remarks;

    public CaseAssignment() {}

    public CaseAssignment(String assignmentId, String caseId, String officerId, String department, String remarks) {
        this.assignmentId = assignmentId;
        this.caseId = caseId;
        this.officerId = officerId;
        this.department = department;
        this.remarks = remarks;
    }

    public String getAssignmentId() { return assignmentId; }
    public void setAssignmentId(String assignmentId) { this.assignmentId = assignmentId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getOfficerId() { return officerId; }
    public void setOfficerId(String officerId) { this.officerId = officerId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }

    public String getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(String acceptedAt) { this.acceptedAt = acceptedAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public String getAssignmentStatus() { return assignmentStatus; }
    public void setAssignmentStatus(String assignmentStatus) { this.assignmentStatus = assignmentStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
