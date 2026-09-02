package com.landstack;

import com.landstack.monitoring.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class HealthEndpointTest {

    @Test
    public void testHealthAndMetricsEndpoints() {
        SystemHealthService healthService = new SystemHealthService();
        MetricsService metricsService = new MetricsService();
        IntegrationMetricsService integrationMetricsService = new IntegrationMetricsService();
        HealthController controller = new HealthController(healthService, metricsService, integrationMetricsService);

        ResponseEntity<Map<String, Object>> healthRes = controller.getHealth();
        assertEquals("HEALTHY", healthRes.getBody().get("status"));

        ResponseEntity<Map<String, Object>> metricsRes = controller.getMetricsSummary("GOV_ADMIN");
        assertTrue(metricsRes.getStatusCode().is2xxSuccessful());
        assertNotNull(metricsRes.getBody().get("totalRequests"));
    }
}
