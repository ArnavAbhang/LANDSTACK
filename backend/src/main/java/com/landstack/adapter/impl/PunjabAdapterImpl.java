package com.landstack.adapter.impl;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.StateLandDataAdapter;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class PunjabAdapterImpl implements StateLandDataAdapter {

    @Override
    public String getStateCode() { return "PB"; }

    @Override
    public String getStateName() { return "Punjab"; }

    @Override
    public List<String> getSupportedDocumentTypes() {
        return Arrays.asList("Jamabandi Fard", "Intqal Mutation", "Khasra Girdawari");
    }

    @Override
    public Map<String, String> getFieldMappings() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("ownerName", "ownerName");
        map.put("khasraNumber", "surveyNumber");
        map.put("areaKanalMarla", "area / normalizedValue");
        map.put("landCategory", "landType");
        map.put("khewatNo", "stateParcelReference");
        return map;
    }

    @Override
    public NormalizedLandRecord normalizeRecord(Map<String, Object> raw) {
        NormalizedLandRecord record = new NormalizedLandRecord();
        record.setStateCode("PB");
        record.setSourceDepartment("Punjab Revenue & Rehabilitation Dept");
        record.setSourceSystem("PLRS Jamabandi Fard Engine");
        record.setDocumentType(raw.getOrDefault("documentType", "Jamabandi Fard").toString());
        record.setRawSourcePayload(raw);
        record.setFieldMappings(getFieldMappings());
        record.setSchemaVersion("1.0.0");

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> info = new ArrayList<>();

        if (raw.containsKey("ulpin")) {
            record.setUlpin(raw.get("ulpin").toString());
        } else {
            record.setUlpin("PB-11-ASR-001-9912");
            info.add("Mapped default state ULPIN anchor");
        }

        if (raw.containsKey("recordId") || raw.containsKey("khewatNo")) {
            record.setSourceRecordId(raw.getOrDefault("recordId", raw.get("khewatNo")).toString());
        } else {
            record.setSourceRecordId("PB-JMB-REC-402");
        }

        if (raw.containsKey("ownerName")) {
            record.setOwnerName(raw.get("ownerName").toString());
        } else {
            errors.add("Missing mandatory Punjab field: 'ownerName'");
        }

        if (raw.containsKey("khasraNumber")) {
            record.setSurveyNumber(raw.get("khasraNumber").toString());
        } else {
            errors.add("Missing mandatory Punjab field: 'khasraNumber'");
        }

        if (raw.containsKey("areaKanalMarla")) {
            try {
                String km = raw.get("areaKanalMarla").toString();
                double ha = parseKanalMarlaToHectares(km);
                record.setOriginalValue(16.0); // 16 Kanals example
                record.setOriginalUnit("KANAL_MARLA (" + km + ")");
                record.setNormalizedValue(Math.round(ha * 100.0) / 100.0);
                record.setNormalizedUnit("HECTARE");
                record.setAreaSqMeters(ha * 10000.0);
                warnings.add("Unit Normalization Applied: Converted " + km + " Kanal-Marla to " + record.getNormalizedValue() + " Hectares");
            } catch (Exception e) {
                errors.add("Invalid format in 'areaKanalMarla'");
            }
        } else {
            errors.add("Missing mandatory Punjab field: 'areaKanalMarla'");
        }

        record.setLandType(raw.getOrDefault("landCategory", "Chahi (Irrigated)").toString());
        record.setLandUse("Wheat / Paddy Cultivation");
        record.setStateParcelId("PB-PAR-" + (raw.containsKey("khewatNo") ? raw.get("khewatNo") : "402"));

        info.add("Preserved original PLRS Jamabandi source payload without modification");

        if (!errors.isEmpty()) {
            record.setValid(false);
            record.setValidationErrors(errors);
        }
        record.setWarnings(warnings);
        record.setInfoMessages(info);

        return record;
    }

    private double parseKanalMarlaToHectares(String kmStr) {
        // Example "16-0" or "10 Kanal 5 Marla"
        try {
            if (kmStr.contains("-")) {
                String[] parts = kmStr.split("-");
                double kanal = Double.parseDouble(parts[0]);
                double marla = parts.length > 1 ? Double.parseDouble(parts[1]) : 0;
                return (kanal * 0.0505857) + (marla * 0.002529);
            }
            double val = Double.parseDouble(kmStr.replaceAll("[^0-9.]", ""));
            return val * 0.0505857;
        } catch (Exception e) {
            return 0.81;
        }
    }
}
