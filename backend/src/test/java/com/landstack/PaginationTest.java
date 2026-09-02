package com.landstack;

import com.landstack.controller.ParcelController;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class PaginationTest {

    @Test
    public void testPaginatedParcelsAndBboxFilter() {
        ParcelController controller = new ParcelController();

        ResponseEntity<?> response = controller.getParcels(0, 5, "73.84,18.52,73.87,18.55", "PUBLIC");
        assertTrue(response.getStatusCode().is2xxSuccessful());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(0, body.get("page"));
        assertEquals(5, body.get("size"));
        assertTrue(body.get("bboxFilterApplied").toString().contains("73.84"));
    }
}
