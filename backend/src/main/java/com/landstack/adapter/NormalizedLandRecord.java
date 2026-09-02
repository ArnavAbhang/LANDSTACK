package com.landstack.adapter;

import java.time.Instant;
import java.util.*;

public class NormalizedLandRecord {
    private String ulpin;
    private String stateParcelId;
    private String stateCode;
    private String sourceDepartment;
    private String sourceSystem;
    private String sourceRecordId;
    private String schemaVersion = "1.0.0";
    
    private String ownerName;
    private String surveyNumber;
    private String landType;
    private String landUse;
    private String documentType;

    // Unit Normalization Fields
    private Double originalValue;
    private String originalUnit;
    private Double normalizedValue; // in Hectares
    private String normalizedUnit = "HECTARE";
    private Double areaSqMeters;

    private Map<String, Object> rawSourcePayload;
    private Map<String, String> fieldMappings;
    
    private boolean isValid = true;
    private List<String> validationErrors = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private List<String> infoMessages = new ArrayList<>();
    private String ingestedAt = Instant.now().toString();

    public NormalizedLandRecord() {}

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getStateParcelId() { return stateParcelId; }
    public void setStateParcelId(String stateParcelId) { this.stateParcelId = stateParcelId; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getSourceDepartment() { return sourceDepartment; }
    public void setSourceDepartment(String sourceDepartment) { this.sourceDepartment = sourceDepartment; }

    public String getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(String sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getSourceRecordId() { return sourceRecordId; }
    public void setSourceRecordId(String sourceRecordId) { this.sourceRecordId = sourceRecordId; }

    public String getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(String schemaVersion) { this.schemaVersion = schemaVersion; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public Double getOriginalValue() { return originalValue; }
    public void setOriginalValue(Double originalValue) { this.originalValue = originalValue; }

    public String getOriginalUnit() { return originalUnit; }
    public void setOriginalUnit(String originalUnit) { this.originalUnit = originalUnit; }

    public Double getNormalizedValue() { return normalizedValue; }
    public void setNormalizedValue(Double normalizedValue) { this.normalizedValue = normalizedValue; }

    public String getNormalizedUnit() { return normalizedUnit; }
    public void setNormalizedUnit(String normalizedUnit) { this.normalizedUnit = normalizedUnit; }

    public Double getAreaSqMeters() { return areaSqMeters; }
    public void setAreaSqMeters(Double areaSqMeters) { this.areaSqMeters = areaSqMeters; }

    public Map<String, Object> getRawSourcePayload() { return rawSourcePayload; }
    public void setRawSourcePayload(Map<String, Object> rawSourcePayload) { this.rawSourcePayload = rawSourcePayload; }

    public Map<String, String> getFieldMappings() { return fieldMappings; }
    public void setFieldMappings(Map<String, String> fieldMappings) { this.fieldMappings = fieldMappings; }

    public boolean isValid() { return isValid; }
    public void setValid(boolean valid) { isValid = valid; }

    public List<String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(List<String> validationErrors) { this.validationErrors = validationErrors; }

    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }

    public List<String> getInfoMessages() { return infoMessages; }
    public void setInfoMessages(List<String> infoMessages) { this.infoMessages = infoMessages; }

    public String getIngestedAt() { return ingestedAt; }
    public void setIngestedAt(String ingestedAt) { this.ingestedAt = ingestedAt; }
}
