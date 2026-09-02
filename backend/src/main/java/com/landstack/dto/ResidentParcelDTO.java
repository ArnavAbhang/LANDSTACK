package com.landstack.dto;

public class ResidentParcelDTO {
    private String ulpin;
    private String stateParcelId;
    private String stateCode;
    private String district;
    private String taluka;
    private String village;
    private String surveyNumber;
    private Double areaSqMeters;
    private Double areaHectare;
    private String ownerName;
    private String landType;
    private String rorExtractType;
    private Double propertyTaxDues;
    private String taxStatus;
    private boolean isOwnerAccess = true;

    public ResidentParcelDTO() {}

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

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getRorExtractType() { return rorExtractType; }
    public void setRorExtractType(String rorExtractType) { this.rorExtractType = rorExtractType; }

    public Double getPropertyTaxDues() { return propertyTaxDues; }
    public void setPropertyTaxDues(Double propertyTaxDues) { this.propertyTaxDues = propertyTaxDues; }

    public String getTaxStatus() { return taxStatus; }
    public void setTaxStatus(String taxStatus) { this.taxStatus = taxStatus; }

    public boolean isOwnerAccess() { return isOwnerAccess; }
    public void setOwnerAccess(boolean ownerAccess) { isOwnerAccess = ownerAccess; }
}
