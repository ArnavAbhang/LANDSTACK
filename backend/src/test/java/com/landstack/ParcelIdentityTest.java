package com.landstack;

import com.landstack.controller.ParcelController;
import com.landstack.dto.GovernmentParcelDTO;

import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import com.landstack.service.AiGovernanceService;
import com.landstack.service.AuditService;
import com.landstack.service.PersonService;
import com.landstack.service.SecurityEventService;
import com.landstack.service.WorkflowEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ParcelIdentityTest {

    private ParcelController parcelController;

    @BeforeEach
    void setUp() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        WorkflowEngineService workflowEngineService = new WorkflowEngineService();
        PersonService personService = new PersonService(auditService, securityEventService);
        AiGovernanceService aiGovernanceService = new AiGovernanceService(workflowEngineService, personService, auditService, securityEventService);

        parcelController = new ParcelController(personService, aiGovernanceService);
    }

    @Test
    void testDistinctParcelIdentitiesForMaharashtra() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_revenue_officer");

        // Parcel 1 -> Rajendra Patil
        ResponseEntity<?> resp1 = parcelController.getParcelByUlpin("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, resp1.getStatusCode());
        GovernmentParcelDTO dto1 = (GovernmentParcelDTO) resp1.getBody();
        assertNotNull(dto1);
        assertEquals("MH-27-PUN-000001", dto1.getUlpin());
        assertEquals("Rajendra Patil", dto1.getOwnerName());
        assertEquals("123/4", dto1.getSurveyNumber());

        // Parcel 2 -> Sneha Kulkarni
        ResponseEntity<?> resp2 = parcelController.getParcelByUlpin("MH-27-PUN-000002", request);
        assertEquals(HttpStatus.OK, resp2.getStatusCode());
        GovernmentParcelDTO dto2 = (GovernmentParcelDTO) resp2.getBody();
        assertNotNull(dto2);
        assertEquals("MH-27-PUN-000002", dto2.getUlpin());
        assertEquals("Sneha Kulkarni", dto2.getOwnerName());
        assertEquals("124/2", dto2.getSurveyNumber());

        // Parcel 3 -> Vijay Jadhav
        ResponseEntity<?> resp3 = parcelController.getParcelByUlpin("MH-27-PUN-000003", request);
        assertEquals(HttpStatus.OK, resp3.getStatusCode());
        GovernmentParcelDTO dto3 = (GovernmentParcelDTO) resp3.getBody();
        assertNotNull(dto3);
        assertEquals("MH-27-PUN-000003", dto3.getUlpin());
        assertEquals("Vijay Jadhav", dto3.getOwnerName());
        assertEquals("125/1", dto3.getSurveyNumber());

        // Parcel 4 -> Meena Shinde
        ResponseEntity<?> resp4 = parcelController.getParcelByUlpin("MH-27-PUN-000004", request);
        assertEquals(HttpStatus.OK, resp4.getStatusCode());
        GovernmentParcelDTO dto4 = (GovernmentParcelDTO) resp4.getBody();
        assertNotNull(dto4);
        assertEquals("MH-27-PUN-000004", dto4.getUlpin());
        assertEquals("Meena Shinde", dto4.getOwnerName());
        assertEquals("126/3", dto4.getSurveyNumber());

        // Parcel 5 -> Sanjay Deshmukh
        ResponseEntity<?> resp5 = parcelController.getParcelByUlpin("MH-27-PUN-000005", request);
        assertEquals(HttpStatus.OK, resp5.getStatusCode());
        GovernmentParcelDTO dto5 = (GovernmentParcelDTO) resp5.getBody();
        assertNotNull(dto5);
        assertEquals("MH-27-PUN-000005", dto5.getUlpin());
        assertEquals("Sanjay Deshmukh", dto5.getOwnerName());
        assertEquals("127/2", dto5.getSurveyNumber());
    }

    @Test
    void testInvalidUlpinReturns404WithoutDefaultFallback() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("authenticatedPrincipal", new AuthPrincipal("LS-PER-00000999", "Officer Deshmukh", "GOVERNMENT", "REVENUE", "MH", "Pune", "Haveli", "Paud"));

        ResponseEntity<?> resp = parcelController.getParcelByUlpin("MH-99-INVALID-999999", request);
        assertEquals(HttpStatus.NOT_FOUND, resp.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) resp.getBody();
        assertNotNull(body);
        assertTrue(((String) body.get("error")).contains("Parcel Information Unavailable"));
    }
}
