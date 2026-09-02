package com.landstack.integration;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GeoJsonDataConnector implements ExternalDataConnector {

    @Override
    public String getSourceId() { return "GEOJSON_FILE"; }

    @Override
    public String getProtocol() { return "GEOJSON"; }

    @Override
    public Map<String, Object> fetchPayload(Map<String, Object> params) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("protocol", "GEOJSON");
        res.put("type", "FeatureCollection");
        res.put("features", params.getOrDefault("features", Collections.emptyList()));
        return res;
    }

    @Override
    public boolean validateConnection() { return true; }
}
