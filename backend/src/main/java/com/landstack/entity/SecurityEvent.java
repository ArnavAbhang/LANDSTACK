package com.landstack.entity;

import java.time.Instant;

public class SecurityEvent {
    private String id;
    private String timestamp = Instant.now().toString();
    private String userId;
    private String userRole;
    private String eventType;
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    private String status = "NEW"; // NEW, ACKNOWLEDGED, INVESTIGATING, RESOLVED
    private String details;
    private String ipAddress = "127.0.0.1";
    private String resourceUlpin;

    public SecurityEvent() {}

    public SecurityEvent(String id, String userId, String userRole, String eventType, String severity, String details, String resourceUlpin) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.eventType = eventType;
        this.severity = severity;
        this.details = details;
        this.resourceUlpin = resourceUlpin;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getResourceUlpin() { return resourceUlpin; }
    public void setResourceUlpin(String resourceUlpin) { this.resourceUlpin = resourceUlpin; }
}
