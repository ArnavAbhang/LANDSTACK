package com.landstack;

import com.landstack.controller.ParcelController;
import com.landstack.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class PaginationTest {

    @Test
    public void testPaginatedParcelsAndBboxFilter() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);
        WorkflowEngineService workflowEngineService = new WorkflowEngineService();
        AiGovernanceService aiGovernanceService = new AiGovernanceService(workflowEngineService);

        ParcelController controller = new ParcelController(personService, aiGovernanceService);
        MockHttpServletRequest request = new MockHttpServletRequest();

        ResponseEntity<?> response = controller.getParcels(0, 5, "73.84,18.52,73.87,18.55", request);
        assertTrue(response.getStatusCode().is2xxSuccessful());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(0, body.get("page"));
        assertEquals(5, body.get("size"));
    }
}
