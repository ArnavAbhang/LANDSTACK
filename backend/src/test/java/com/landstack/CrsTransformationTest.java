package com.landstack;

import com.landstack.service.CrsTransformationService;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class CrsTransformationTest {

    @Test
    public void testCrsDetectionAndTransformation() {
        CrsTransformationService service = new CrsTransformationService();

        Map<String, Object> payload = Map.of(
            "crs", Map.of("properties", Map.of("name", "EPSG:32643"))
        );

        String detected = service.detectCrs(payload);
        assertEquals("EPSG:32643", detected);

        Map<String, Object> transformRes = service.transformGeometryToWgs84(Map.of(), detected);
        assertEquals("EPSG:4326", transformRes.get("targetCrs"));
        assertTrue(transformRes.get("transformationApplied").toString().contains("ST_Transform"));
    }
}
