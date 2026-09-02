package com.landstack.monitoring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("systemHealthController")
@RequestMapping("/api/monitoring")
@CrossOrigin(origins = "*")
public class HealthController {

    private final SystemHealthService healthService;
    private final MetricsService metricsService;
    private final IntegrationMetricsService integrationMetricsService;

    @Autowired
    public HealthController(SystemHealthService healthService, MetricsService metricsService, IntegrationMetricsService integrationMetricsService) {
        this.healthService = healthService;
        this.metricsService = metricsService;
        this.integrationMetricsService = integrationMetricsService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(healthService.getOverallHealth());
    }

    @GetMapping("/health/database")
    public ResponseEntity<Map<String, Object>> getDatabaseHealth() {
        return ResponseEntity.ok(healthService.getDatabaseHealth());
    }

    @GetMapping("/health/postgis")
    public ResponseEntity<Map<String, Object>> getPostGisHealth() {
        return ResponseEntity.ok(healthService.getPostGisHealth());
    }

    @GetMapping("/health/ai")
    public ResponseEntity<Map<String, Object>> getAiHealth() {
        return ResponseEntity.ok(healthService.getAiHealth());
    }

    @GetMapping("/health/integrations")
    public ResponseEntity<Map<String, Object>> getIntegrationHealth() {
        return ResponseEntity.ok(healthService.getIntegrationHealth());
    }

    @GetMapping("/metrics/summary")
    public ResponseEntity<Map<String, Object>> getMetricsSummary(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Restricted: Metrics summary requires Government or Admin authorization."));
        }
        return ResponseEntity.ok(metricsService.getMetricsSummary());
    }
}
