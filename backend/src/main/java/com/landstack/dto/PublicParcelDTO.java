package com.landstack.dto;

public class PublicParcelDTO {
    private String ulpin;
    private String stateParcelId;
    private String stateCode;
    private String district;
    private String taluka;
    private String village;
    private String surveyNumber;
    private Double areaSqMeters;
    private Double areaHectare;
    private String maskedOwnerName; // e.g. "R. A. D******"
    private String landType;
    private String landUse;
    private String privacyClassification = "PUBLIC";

    public PublicParcelDTO() {}

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getStateParcelId() { return stateParcelId; }
    public void setStateParcelId(String stateParcelId) { this.stateParcelId = stateParcelId; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluka() { return taluka; }
    public void setTaluka(String taluka) { this.taluka = taluka; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public Double getAreaSqMeters() { return areaSqMeters; }
    public void setAreaSqMeters(Double areaSqMeters) { this.areaSqMeters = areaSqMeters; }

    public Double getAreaHectare() { return areaHectare; }
    public void setAreaHectare(Double areaHectare) { this.areaHectare = areaHectare; }

    public String getMaskedOwnerName() { return maskedOwnerName; }
    public void setMaskedOwnerName(String maskedOwnerName) { this.maskedOwnerName = maskedOwnerName; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }

    public String getPrivacyClassification() { return privacyClassification; }
    public void setPrivacyClassification(String privacyClassification) { this.privacyClassification = privacyClassification; }
}
