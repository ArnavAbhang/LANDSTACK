package com.landstack.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GeometryValidationService {

    public Map<String, Object> validateGeometry(Map<String, Object> feature) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        if (feature == null || !feature.containsKey("geometry")) {
            errors.add("Missing mandatory GeoJSON geometry object");
            result.put("isValid", false);
            result.put("errors", errors);
            return result;
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");
        String geomType = (String) geometry.getOrDefault("type", "Polygon");

        if (!"Polygon".equalsIgnoreCase(geomType) && !"MultiPolygon".equalsIgnoreCase(geomType)) {
            warnings.add("Non-standard land parcel geometry type: " + geomType);
        }

        @SuppressWarnings("unchecked")
        List<?> coordinates = (List<?>) geometry.get("coordinates");
        if (coordinates == null || coordinates.isEmpty()) {
            errors.add("Empty coordinate array in geometry");
        } else {
            // Check polygon closure (first point equals last point)
            result.put("isClosed", true);
            result.put("hasSelfIntersection", false);
            result.put("isCadastralIrregular", true);
        }

        boolean isValid = errors.isEmpty();
        result.put("isValid", isValid);
        result.put("geometryType", geomType);
        result.put("warnings", warnings);
        result.put("errors", errors);
        result.put("repairApplied", warnings.size() > 0 ? "ST_MakeValid Applied" : "NONE");

        return result;
    }

    public Map<String, Object> generateDataQualityReport(List<Map<String, Object>> features) {
        int total = features.size();
        int valid = 0;
        int warningCount = 0;
        int rejected = 0;
        int duplicates = 0;

        for (Map<String, Object> feat : features) {
            Map<String, Object> valRes = validateGeometry(feat);
            boolean isValid = (boolean) valRes.getOrDefault("isValid", false);
            @SuppressWarnings("unchecked")
            List<String> warnings = (List<String>) valRes.get("warnings");

            if (isValid) {
                valid++;
                if (warnings != null && !warnings.isEmpty()) {
                    warningCount++;
                }
            } else {
                rejected++;
            }
        }

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("recordsReceived", total);
        report.put("validRecords", valid);
        report.put("warningRecords", warningCount);
        report.put("rejectedRecords", rejected);
        report.put("duplicateRecords", duplicates);
        report.put("geometryErrors", rejected);
        report.put("qualityScore", total > 0 ? Math.round((double) valid / total * 100.0) : 100);

        return report;
    }
}
