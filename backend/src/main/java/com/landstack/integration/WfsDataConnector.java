package com.landstack.integration;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class WfsDataConnector implements ExternalDataConnector {

    @Override
    public String getSourceId() { return "WFS_VECTOR"; }

    @Override
    public String getProtocol() { return "WFS"; }

    @Override
    public Map<String, Object> fetchPayload(Map<String, Object> params) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("protocol", "WFS");
        res.put("outputFormat", "application/json");
        res.put("typeName", params.getOrDefault("typeName", "landstack:parcels"));
        return res;
    }

    @Override
    public boolean validateConnection() { return true; }
}
