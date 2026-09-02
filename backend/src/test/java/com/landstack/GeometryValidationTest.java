package com.landstack;

import com.landstack.service.GeometryValidationService;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class GeometryValidationTest {

    @Test
    public void testCadastralGeometryValidation() {
        GeometryValidationService service = new GeometryValidationService();

        Map<String, Object> feature = new HashMap<>();
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "Polygon");
        geometry.put("coordinates", List.of(
            List.of(
                List.of(73.840, 18.520),
                List.of(73.845, 18.522),
                List.of(73.843, 18.525),
                List.of(73.840, 18.520)
            )
        ));
        feature.put("geometry", geometry);

        Map<String, Object> result = service.validateGeometry(feature);
        assertTrue((boolean) result.get("isValid"));
        assertEquals("Polygon", result.get("geometryType"));
        assertTrue((boolean) result.get("isCadastralIrregular"));
    }
}
