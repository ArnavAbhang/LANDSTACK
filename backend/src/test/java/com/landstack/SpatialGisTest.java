package com.landstack;

import com.landstack.service.SpatialAnalysisService;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class SpatialGisTest {

    @Test
    public void testSpatialRiskCalculatorHighRisk() {
        SpatialAnalysisService service = new SpatialAnalysisService();
        Map<String, Object> result = service.calculateSpatialRisk("MH-27-PUN-002-9103");

        assertEquals("HIGH", result.get("riskLevel"));
        assertTrue((Double) result.get("riskScore") > 0.7);
        assertNotNull(result.get("explainabilityReasons"));
    }

    @Test
    public void testSpatialRiskCalculatorLowRisk() {
        SpatialAnalysisService service = new SpatialAnalysisService();
        Map<String, Object> result = service.calculateSpatialRisk("MH-27-PUN-001-8472");

        assertEquals("LOW", result.get("riskLevel"));
        assertTrue((Double) result.get("riskScore") < 0.3);
    }

    @Test
    public void testParcelComparison() {
        SpatialAnalysisService service = new SpatialAnalysisService();
        Map<String, Object> comparison = service.compareParcels("MH-27-PUN-001-8472", "MH-27-PUN-002-9103");

        assertNotNull(comparison.get("parcel1"));
        assertNotNull(comparison.get("parcel2"));
        assertTrue((Boolean) comparison.get("boundaryConflictDetected"));
    }
}
