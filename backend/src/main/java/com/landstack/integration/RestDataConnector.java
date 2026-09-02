package com.landstack.integration;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class RestDataConnector implements ExternalDataConnector {

    @Override
    public String getSourceId() { return "REST_GENERIC"; }

    @Override
    public String getProtocol() { return "REST"; }

    @Override
    public Map<String, Object> fetchPayload(Map<String, Object> params) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("protocol", "REST");
        res.put("fetchedAt", new Date().toString());
        res.put("data", params.getOrDefault("payload", params));
        return res;
    }

    @Override
    public boolean validateConnection() { return true; }
}
