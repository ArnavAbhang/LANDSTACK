package com.landstack.dto;

import java.util.Map;

public class GovernmentParcelDTO {

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
    private String rorType;
    private String taxStatus;
    private Double taxDues;
    private String disputeRisk;
    private String disputeSummary;
    private String systemClearance;
    private Map<String, Object> aiRiskGovernanceEvaluation;
    private Map<String, Object> rawSourcePayload;
    private String accessTier = "GOVERNMENT_FULL_DOSSIER";

    public GovernmentParcelDTO(String ulpin, String stateParcelId, String state, String district, String taluka, String village, String surveyNumber, String areaDisplay, String landType, String ownerName, String rorType, String taxStatus, Double taxDues, String disputeRisk, String disputeSummary, String systemClearance, Map<String, Object> aiRiskGovernanceEvaluation, Map<String, Object> rawSourcePayload) {
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
        this.rorType = rorType;
        this.taxStatus = taxStatus;
        this.taxDues = taxDues;
        this.disputeRisk = disputeRisk;
        this.disputeSummary = disputeSummary;
        this.systemClearance = systemClearance;
        this.aiRiskGovernanceEvaluation = aiRiskGovernanceEvaluation;
        this.rawSourcePayload = rawSourcePayload;
    }

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
    public String getRorType() { return rorType; }
    public String getTaxStatus() { return taxStatus; }
    public Double getTaxDues() { return taxDues; }
    public String getDisputeRisk() { return disputeRisk; }
    public String getDisputeSummary() { return disputeSummary; }
    public String getSystemClearance() { return systemClearance; }
    public Map<String, Object> getAiRiskGovernanceEvaluation() { return aiRiskGovernanceEvaluation; }
    public Map<String, Object> getRawSourcePayload() { return rawSourcePayload; }
    public String getAccessTier() { return accessTier; }
}
