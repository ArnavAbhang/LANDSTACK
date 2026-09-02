package com.landstack;

import com.landstack.service.SatelliteIntegrationService;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class SatelliteIntegrationTest {

    @Test
    public void testVillageBoundingBoxAndChangeDetection() {
        SatelliteIntegrationService service = new SatelliteIntegrationService();

        Map<String, Object> bbox = service.getVillageBoundingBox("PAUD_001");
        assertNotNull(bbox.get("minLat"));
        assertNotNull(bbox.get("minLng"));
        assertEquals(16, bbox.get("zoom"));

        Map<String, Object> changeRes = service.runSatelliteChangeDetection("MH-27-PUN-000003");
        assertEquals("HIGH", changeRes.get("riskLevel"));
        assertTrue((boolean) changeRes.get("requiresHumanReview"));
    }
}
