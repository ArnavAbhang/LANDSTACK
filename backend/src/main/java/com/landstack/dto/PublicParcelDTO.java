package com.landstack.dto;

public class PublicParcelDTO {

    private String ulpin;
    private String stateParcelId;
    private String state;
    private String district;
    private String taluka;
    private String village;
    private String surveyNumber;
    private String areaDisplay;
    private String landType;
    private String ownerNameMasked;
    private String ownerName;
    private String disputeRisk = "LOW";
    private String publicAccessTier = "PUBLIC_METADATA_ONLY";

    public PublicParcelDTO(String ulpin, String stateParcelId, String state, String district, String taluka, String village, String surveyNumber, String areaDisplay, String landType, String ownerName) {
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
        this.ownerNameMasked = maskName(ownerName);
        if (ulpin != null && (ulpin.contains("000003") || ulpin.contains("000004"))) {
            this.disputeRisk = ulpin.contains("000003") ? "HIGH" : "MEDIUM";
        }
    }

    private String maskName(String name) {
        if (name == null) return "Unknown";
        String[] parts = name.split(" ");
        if (parts.length > 1) {
            return parts[0] + " " + parts[1].substring(0, 1) + "***";
        }
        return name.substring(0, Math.min(2, name.length())) + "***";
    }

    public String getDisputeRisk() { return disputeRisk; }
    public String getRiskLevel() { return disputeRisk; }
    public String getOwnerName() { return ownerName; }

    public String getUlpin() { return ulpin; }
    public String getStateParcelId() { return stateParcelId; }
    public String getState() { return state; }
    public String getDistrict() { return district; }
    public String getTaluka() { return taluka; }
    public String getVillage() { return village; }
    public String getSurveyNumber() { return surveyNumber; }
    public String getAreaDisplay() { return areaDisplay; }
    public String getLandType() { return landType; }
    public String getOwnerNameMasked() { return ownerNameMasked; }
    public String getPublicAccessTier() { return publicAccessTier; }
}
