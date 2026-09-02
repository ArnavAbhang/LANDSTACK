package com.landstack.integration;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class WmsDataConnector implements ExternalDataConnector {

    @Override
    public String getSourceId() { return "WMS_RASTER"; }

    @Override
    public String getProtocol() { return "WMS"; }

    @Override
    public Map<String, Object> fetchPayload(Map<String, Object> params) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("protocol", "WMS");
        res.put("tileFormat", "image/png");
        res.put("layers", params.getOrDefault("layers", "cadastral_parcels"));
        return res;
    }

    @Override
    public boolean validateConnection() { return true; }
}
