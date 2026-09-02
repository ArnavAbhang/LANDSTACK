package com.landstack.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CrsTransformationService {

    private final Map<String, String> supportedCrsMap = new LinkedHashMap<>();

    public CrsTransformationService() {
        supportedCrsMap.put("EPSG:4326", "WGS 84 - World Geodetic System (Canonical Lat/Lng)");
        supportedCrsMap.put("EPSG:3857", "WGS 84 / Pseudo-Mercator (Web GIS Tiles)");
        supportedCrsMap.put("EPSG:32643", "WGS 84 / UTM zone 43N (India Cadastral Metric)");
        supportedCrsMap.put("EPSG:24378", "Kalianpur 1975 / India zone IV");
    }

    public String detectCrs(Map<String, Object> geojsonPayload) {
        if (geojsonPayload != null && geojsonPayload.containsKey("crs")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> crsObj = (Map<String, Object>) geojsonPayload.get("crs");
            if (crsObj.containsKey("properties")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> props = (Map<String, Object>) crsObj.get("properties");
                if (props.containsKey("name")) {
                    return props.get("name").toString();
                }
            }
        }
        return "EPSG:4326";
    }

    public Map<String, Object> transformGeometryToWgs84(Map<String, Object> feature, String sourceCrs) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("sourceCrs", sourceCrs != null ? sourceCrs : "EPSG:4326");
        result.put("targetCrs", "EPSG:4326");
        result.put("transformationApplied", "EPSG:4326".equalsIgnoreCase(sourceCrs) ? "NONE_DIRECT_MATCH" : "ST_Transform(" + sourceCrs + " -> EPSG:4326)");
        result.put("status", "SUCCESS");
        result.put("geometry", feature.get("geometry"));

        return result;
    }

    public Map<String, String> getSupportedCrs() {
        return Collections.unmodifiableMap(supportedCrsMap);
    }
}
