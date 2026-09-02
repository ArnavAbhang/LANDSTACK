package com.landstack;

import com.landstack.monitoring.SystemHealthService;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ProductionIndexTest {

    @Test
    public void testPostGisSpatialIndexAndHealth() {
        SystemHealthService healthService = new SystemHealthService();

        Map<String, Object> postgisHealth = healthService.getPostGisHealth();
        assertEquals("HEALTHY", postgisHealth.get("status"));
        assertTrue(postgisHealth.get("spatialIndex").toString().contains("GiST ACTIVE"));
    }
}
