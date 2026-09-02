package com.landstack.entity;

import java.time.Instant;

public class Incident {
    private String incidentId;
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    private String category; // DATABASE_FAILURE, AI_SERVICE_FAILURE, INTEGRATION_FAILURE, SECURITY_INCIDENT, GIS_FAILURE, WORKFLOW_FAILURE, SYSTEM_DEGRADATION
    private String description;
    private String status = "OPEN"; // OPEN, ACKNOWLEDGED, INVESTIGATING, MITIGATED, RESOLVED, CLOSED
    private String createdAt = Instant.now().toString();
    private String acknowledgedAt;
    private String resolvedAt;
    private String assignedTo;
    private String correlationId;

    public Incident() {}

    public Incident(String incidentId, String severity, String category, String description, String assignedTo, String correlationId) {
        this.incidentId = incidentId;
        this.severity = severity;
        this.category = category;
        this.description = description;
        this.assignedTo = assignedTo;
        this.correlationId = correlationId;
    }

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(String acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public String getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(String resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
}
