package com.landstack.dto;

import java.util.Map;

public class GovernmentParcelDTO {
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
    private String landUse;
    private String rorExtractType;
    private Double propertyTaxDues;
    private String taxStatus;
    private String disputeStatus;
    private Integer aiRiskScore;
    private String aiRiskLevel;
    private String userRole;
    private String departmentCode;
    private String jurisdictionScope;
    private Map<String, Object> rawSourcePayload; // Null if officer not authorized

    public GovernmentParcelDTO() {}

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

    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }

    public String getRorExtractType() { return rorExtractType; }
    public void setRorExtractType(String rorExtractType) { this.rorExtractType = rorExtractType; }

    public Double getPropertyTaxDues() { return propertyTaxDues; }
    public void setPropertyTaxDues(Double propertyTaxDues) { this.propertyTaxDues = propertyTaxDues; }

    public String getTaxStatus() { return taxStatus; }
    public void setTaxStatus(String taxStatus) { this.taxStatus = taxStatus; }

    public String getDisputeStatus() { return disputeStatus; }
    public void setDisputeStatus(String disputeStatus) { this.disputeStatus = disputeStatus; }

    public Integer getAiRiskScore() { return aiRiskScore; }
    public void setAiRiskScore(Integer aiRiskScore) { this.aiRiskScore = aiRiskScore; }

    public String getAiRiskLevel() { return aiRiskLevel; }
    public void setAiRiskLevel(String aiRiskLevel) { this.aiRiskLevel = aiRiskLevel; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getJurisdictionScope() { return jurisdictionScope; }
    public void setJurisdictionScope(String jurisdictionScope) { this.jurisdictionScope = jurisdictionScope; }

    public Map<String, Object> getRawSourcePayload() { return rawSourcePayload; }
    public void setRawSourcePayload(Map<String, Object> rawSourcePayload) { this.rawSourcePayload = rawSourcePayload; }
}
