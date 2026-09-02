package com.landstack.monitoring;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IntegrationMetricsService {

    public Map<String, Object> getIntegrationMetrics() {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("registeredSources", 5);
        metrics.put("activeConnectors", List.of("REST", "GEOJSON", "WMS", "WFS"));
        metrics.put("throughputRecordsPerSec", 1450);
        metrics.put("failedSyncsCount", 0);
        metrics.put("idempotencyKeyProtection", "ENABLED");
        metrics.put("statusDistinctionMode", "EXPLICIT_TAGGING");

        return metrics;
    }
}
