package com.landstack.adapter.impl;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.StateLandDataAdapter;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MaharashtraAdapterImpl implements StateLandDataAdapter {

    @Override
    public String getStateCode() { return "MH"; }

    @Override
    public String getStateName() { return "Maharashtra"; }

    @Override
    public List<String> getSupportedDocumentTypes() {
        return Arrays.asList("7/12 Extract", "8A Extract", "Mutation Ferfar");
    }

    @Override
    public Map<String, String> getFieldMappings() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("khatedarName", "ownerName");
        map.put("surveyNo", "surveyNumber");
        map.put("areaHectare", "area / normalizedValue");
        map.put("jameenPrakar", "landType");
        map.put("khataNo", "stateParcelReference");
        return map;
    }

    @Override
    public NormalizedLandRecord normalizeRecord(Map<String, Object> raw) {
        NormalizedLandRecord record = new NormalizedLandRecord();
        record.setStateCode("MH");
        record.setSourceDepartment("Maharashtra Revenue & Land Records Dept");
        record.setSourceSystem("MahaBhulekh 7/12 & 8A Engine");
        record.setDocumentType(raw.getOrDefault("documentType", "7/12 Extract").toString());
        record.setRawSourcePayload(raw);
        record.setFieldMappings(getFieldMappings());
        record.setSchemaVersion("1.0.0");

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> info = new ArrayList<>();

        if (raw.containsKey("ulpin")) {
            record.setUlpin(raw.get("ulpin").toString());
        } else {
            record.setUlpin("MH-27-PUN-000001");
            info.add("Mapped default state ULPIN anchor");
        }

        if (raw.containsKey("recordId") || raw.containsKey("khataNo")) {
            record.setSourceRecordId(raw.getOrDefault("recordId", raw.get("khataNo")).toString());
        } else {
            record.setSourceRecordId("MH-712-REC-001");
        }

        if (raw.containsKey("khatedarName")) {
            record.setOwnerName(raw.get("khatedarName").toString());
        } else {
            errors.add("Missing mandatory Maharashtra field: 'khatedarName'");
        }

        if (raw.containsKey("surveyNo")) {
            record.setSurveyNumber(raw.get("surveyNo").toString());
        } else {
            errors.add("Missing mandatory Maharashtra field: 'surveyNo'");
        }

        if (raw.containsKey("areaHectare")) {
            try {
                double val = Double.parseDouble(raw.get("areaHectare").toString());
                record.setOriginalValue(val);
                record.setOriginalUnit("HECTARE");
                record.setNormalizedValue(val);
                record.setNormalizedUnit("HECTARE");
                record.setAreaSqMeters(val * 10000.0);
            } catch (Exception e) {
                errors.add("Invalid numeric area format in 'areaHectare'");
            }
        } else {
            errors.add("Missing mandatory Maharashtra field: 'areaHectare'");
        }

        record.setLandType(raw.getOrDefault("jameenPrakar", "Agricultural").toString());
        record.setLandUse(record.getLandType());
        record.setStateParcelId("MH-PAR-" + (raw.containsKey("khataNo") ? raw.get("khataNo") : "0001"));

        info.add("Preserved original 7/12 extract source payload without modification");
        
        if (!errors.isEmpty()) {
            record.setValid(false);
            record.setValidationErrors(errors);
        }
        record.setWarnings(warnings);
        record.setInfoMessages(info);

        return record;
    }
}
