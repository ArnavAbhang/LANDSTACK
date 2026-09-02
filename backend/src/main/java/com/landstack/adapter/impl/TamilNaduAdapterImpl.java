package com.landstack.adapter.impl;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.StateLandDataAdapter;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class TamilNaduAdapterImpl implements StateLandDataAdapter {

    @Override
    public String getStateCode() { return "TN"; }

    @Override
    public String getStateName() { return "Tamil Nadu"; }

    @Override
    public List<String> getSupportedDocumentTypes() {
        return Arrays.asList("Patta Extract", "Chitta Extract", "Adangal Register");
    }

    @Override
    public Map<String, String> getFieldMappings() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("pattaHolder", "ownerName");
        map.put("surveyNumber", "surveyNumber");
        map.put("extentAcres", "area / normalizedValue");
        map.put("classification", "landType");
        map.put("pattaNo", "stateParcelReference");
        return map;
    }

    @Override
    public NormalizedLandRecord normalizeRecord(Map<String, Object> raw) {
        NormalizedLandRecord record = new NormalizedLandRecord();
        record.setStateCode("TN");
        record.setSourceDepartment("Tamil Nadu Revenue & Disaster Management Dept");
        record.setSourceSystem("Tamil Nilam Patta Chitta Engine");
        record.setDocumentType(raw.getOrDefault("documentType", "Patta Extract").toString());
        record.setRawSourcePayload(raw);
        record.setFieldMappings(getFieldMappings());
        record.setSchemaVersion("1.0.0");

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> info = new ArrayList<>();

        if (raw.containsKey("ulpin")) {
            record.setUlpin(raw.get("ulpin").toString());
        } else {
            record.setUlpin("TN-33-KCH-001-4412");
            info.add("Mapped default state ULPIN anchor");
        }

        if (raw.containsKey("recordId") || raw.containsKey("pattaNo")) {
            record.setSourceRecordId(raw.getOrDefault("recordId", raw.get("pattaNo")).toString());
        } else {
            record.setSourceRecordId("TN-PATTA-REC-1082");
        }

        if (raw.containsKey("pattaHolder")) {
            record.setOwnerName(raw.get("pattaHolder").toString());
        } else {
            errors.add("Missing mandatory Tamil Nadu field: 'pattaHolder'");
        }

        if (raw.containsKey("surveyNumber")) {
            record.setSurveyNumber(raw.get("surveyNumber").toString());
        } else {
            errors.add("Missing mandatory Tamil Nadu field: 'surveyNumber'");
        }

        Object extentObj = raw.containsKey("extentAcres") ? raw.get("extentAcres") : raw.get("extent");
        if (extentObj != null) {
            try {
                String strVal = extentObj.toString().replaceAll("[^0-9.]", "");
                double acres = Double.parseDouble(strVal);
                double ha = acres * 0.404686; // Unit Normalization: Acre to Hectare
                record.setOriginalValue(acres);
                record.setOriginalUnit("ACRE");
                record.setNormalizedValue(Math.round(ha * 100.0) / 100.0);
                record.setNormalizedUnit("HECTARE");
                record.setAreaSqMeters(acres * 4046.86);
                warnings.add("Unit Normalization Applied: Converted " + acres + " Acres to " + record.getNormalizedValue() + " Hectares");
            } catch (Exception e) {
                errors.add("Invalid numeric format in 'extent'");
            }
        } else {
            errors.add("Missing mandatory Tamil Nadu field: 'extent' or 'extentAcres'");
        }

        record.setLandType(raw.getOrDefault("classification", "Agricultural (Nanjai)").toString());
        record.setLandUse("Paddy Cultivation");
        record.setStateParcelId("TN-PAR-" + (raw.containsKey("pattaNo") ? raw.get("pattaNo") : "1082"));

        info.add("Preserved original Tamil Nilam source payload without modification");

        if (!errors.isEmpty()) {
            record.setValid(false);
            record.setValidationErrors(errors);
        }
        record.setWarnings(warnings);
        record.setInfoMessages(info);

        return record;
    }
}
