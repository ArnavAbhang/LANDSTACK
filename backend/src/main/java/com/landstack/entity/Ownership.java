package com.landstack.entity;

import java.time.Instant;

public class Ownership {
    private Long id;
    private String ownershipId;
    private String personId;
    private Long parcelId;
    private String ulpin;
    private String ownershipType = "SOLE"; // SOLE, JOINT, INHERITED, LEGAL_REPRESENTATIVE, OTHER
    private Double ownershipShare = 100.00;
    private String validFrom = Instant.now().toString().substring(0, 10);
    private String validTo;
    private String status = "ACTIVE"; // ACTIVE, HISTORICAL, PENDING, DISPUTED
    private String sourceRecordId;
    private String sourceState;
    private String sourceSystem;
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();

    public Ownership() {}

    public Ownership(String ownershipId, String personId, String ulpin, String ownershipType, Double ownershipShare, String status, String sourceState, String sourceSystem) {
        this.ownershipId = ownershipId;
        this.personId = personId;
        this.ulpin = ulpin;
        this.ownershipType = ownershipType;
        this.ownershipShare = ownershipShare;
        this.status = status;
        this.sourceState = sourceState;
        this.sourceSystem = sourceSystem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOwnershipId() { return ownershipId; }
    public void setOwnershipId(String ownershipId) { this.ownershipId = ownershipId; }

    public String getPersonId() { return personId; }
    public void setPersonId(String personId) { this.personId = personId; }

    public Long getParcelId() { return parcelId; }
    public void setParcelId(Long parcelId) { this.parcelId = parcelId; }

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getOwnershipType() { return ownershipType; }
    public void setOwnershipType(String ownershipType) { this.ownershipType = ownershipType; }

    public Double getOwnershipShare() { return ownershipShare; }
    public void setOwnershipShare(Double ownershipShare) { this.ownershipShare = ownershipShare; }

    public String getValidFrom() { return validFrom; }
    public void setValidFrom(String validFrom) { this.validFrom = validFrom; }

    public String getValidTo() { return validTo; }
    public void setValidTo(String validTo) { this.validTo = validTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSourceRecordId() { return sourceRecordId; }
    public void setSourceRecordId(String sourceRecordId) { this.sourceRecordId = sourceRecordId; }

    public String getSourceState() { return sourceState; }
    public void setSourceState(String sourceState) { this.sourceState = sourceState; }

    public String getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(String sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
