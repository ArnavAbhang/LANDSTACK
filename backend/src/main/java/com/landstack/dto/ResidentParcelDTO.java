package com.landstack.dto;

public class ResidentParcelDTO {

    private String ulpin;
    private String stateParcelId;
    private String state;
    private String district;
    private String taluka;
    private String village;
    private String surveyNumber;
    private String areaDisplay;
    private String landType;
    private String ownerName;
    private Double ownershipShare;
    private String ownershipType;
    private String rorType;
    private String disputeRisk = "LOW";
    private String citizenStatusNotice = "Authenticated Citizen Land Record Verified";
    private String accessTier = "RESIDENT_OWNER_AUTHORIZED";

    public ResidentParcelDTO(String ulpin, String stateParcelId, String state, String district, String taluka, String village, String surveyNumber, String areaDisplay, String landType, String ownerName, Double ownershipShare, String ownershipType, String rorType) {
        this.ulpin = ulpin;
        this.stateParcelId = stateParcelId;
        this.state = state;
        this.district = district;
        this.taluka = taluka;
        this.village = village;
        this.surveyNumber = surveyNumber;
        this.areaDisplay = areaDisplay;
        this.landType = landType;
        this.ownerName = ownerName;
        this.ownershipShare = ownershipShare != null ? ownershipShare : 100.0;
        this.ownershipType = ownershipType != null ? ownershipType : "SOLE";
        this.rorType = rorType != null ? rorType : "7/12 & 8A Extract";
        if (ulpin != null && (ulpin.contains("000003") || ulpin.contains("000004"))) {
            this.disputeRisk = ulpin.contains("000003") ? "HIGH" : "MEDIUM";
        }
    }

    public String getDisputeRisk() { return disputeRisk; }
    public String getRiskLevel() { return disputeRisk; }

    public String getUlpin() { return ulpin; }
    public String getStateParcelId() { return stateParcelId; }
    public String getState() { return state; }
    public String getDistrict() { return district; }
    public String getTaluka() { return taluka; }
    public String getVillage() { return village; }
    public String getSurveyNumber() { return surveyNumber; }
    public String getAreaDisplay() { return areaDisplay; }
    public String getLandType() { return landType; }
    public String getOwnerName() { return ownerName; }
    public Double getOwnershipShare() { return ownershipShare; }
    public String getOwnershipType() { return ownershipType; }
    public String getRorType() { return rorType; }
    public String getCitizenStatusNotice() { return citizenStatusNotice; }
    public String getAccessTier() { return accessTier; }
}
