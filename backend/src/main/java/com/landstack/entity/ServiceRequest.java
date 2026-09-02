package com.landstack.entity;

import java.time.Instant;

public class ServiceRequest {
    private String id;
    private String requestNumber;
    private String requestType; // MUTATION_REQUEST, LAND_RECORD_CORRECTION, OWNERSHIP_UPDATE, BOUNDARY_DISPUTE, FIELD_VERIFICATION, PROPERTY_TAX_REQUEST, REGISTRATION_VERIFICATION, ENCUMBRANCE_VERIFICATION, LAND_USE_CHANGE, AI_RISK_INVESTIGATION, OTHER
    private String requesterId;
    private String ulpin;
    private String stateCode;
    private String districtId;
    private String talukaId;
    private String villageId;
    private String department;
    private String priority = "NORMAL"; // LOW, NORMAL, HIGH, URGENT
    private String status = "SUBMITTED"; // SUBMITTED, UNDER_VALIDATION, ASSIGNED, UNDER_REVIEW, FIELD_VERIFICATION_REQUIRED, AWAITING_DOCUMENTS, APPROVED, REJECTED, ESCALATED, COMPLETED, CLOSED
    private String description;
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();

    public ServiceRequest() {}

    public ServiceRequest(String id, String requestNumber, String requestType, String requesterId, String ulpin, String stateCode, String districtId, String talukaId, String villageId, String department, String description) {
        this.id = id;
        this.requestNumber = requestNumber;
        this.requestType = requestType;
        this.requesterId = requesterId;
        this.ulpin = ulpin;
        this.stateCode = stateCode;
        this.districtId = districtId;
        this.talukaId = talukaId;
        this.villageId = villageId;
        this.department = department;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getRequesterId() { return requesterId; }
    public void setRequesterId(String requesterId) { this.requesterId = requesterId; }

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getTalukaId() { return talukaId; }
    public void setTalukaId(String talukaId) { this.talukaId = talukaId; }

    public String getVillageId() { return villageId; }
    public void setVillageId(String villageId) { this.villageId = villageId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
