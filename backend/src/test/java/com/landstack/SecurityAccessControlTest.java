package com.landstack;

import com.landstack.controller.AdapterController;
import com.landstack.controller.AiController;
import com.landstack.controller.ParcelController;
import com.landstack.controller.PersonController;
import com.landstack.dto.GovernmentParcelDTO;
import com.landstack.dto.PublicParcelDTO;
import com.landstack.dto.ResidentParcelDTO;
import com.landstack.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityAccessControlTest {

    private ParcelController parcelController;
    private AiController aiController;
    private PersonController personController;
    private AdapterController adapterController;

    @BeforeEach
    public void setup() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);
        WorkflowEngineService workflowEngineService = new WorkflowEngineService();
        AiGovernanceService aiGovernanceService = new AiGovernanceService(workflowEngineService);
        PersonMatchingService matchingService = new PersonMatchingService();

        parcelController = new ParcelController(personService, aiGovernanceService);
        aiController = new AiController(aiGovernanceService);
        personController = new PersonController(personService, matchingService);
        adapterController = new AdapterController(Collections.emptyList());
    }

    @Test
    public void testResidentAccessOwnParcel_Allowed() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof ResidentParcelDTO);

        ResidentParcelDTO dto = (ResidentParcelDTO) response.getBody();
        assertEquals("MH-27-PUN-000001", dto.getUlpin());
        assertEquals("Rajendra Patil", dto.getOwnerName());
    }

    @Test
    public void testResidentAccessOtherResidentParcel_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        // Rajendra Patil (Resident A) attempting to access Parcel B (MH-27-PUN-000002 owned by Sneha Kulkarni)
        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-000002", request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, String> errMap = (Map<String, String>) response.getBody();
        assertNotNull(errMap);
        assertTrue(errMap.get("error").contains("Access Denied"));
    }

    @Test
    public void testResidentChangeUlpinToOtherParcel_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        // Resident attempting to change URL ULPIN parameter to 000004
        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-000004", request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testResidentRequestOtherPersonId_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra"); // Authenticated as LS-PER-00000125

        // Attempting to fetch Person ID LS-PER-00000341 (Sneha Deshmukh)
        ResponseEntity<?> response = personController.getPersonById("LS-PER-00000341", request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testResidentAccessAiRiskEndpoint_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        ResponseEntity<?> response = aiController.getParcelRisk("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testResidentAccessAiAlertsEndpoint_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        ResponseEntity<?> response = aiController.getAlerts(request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testResidentSearchPersons_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        ResponseEntity<?> response = personController.searchPersons("Vijay", null, null, null, null, null, null, request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testResidentAccessRawSourcePayload_Denied() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_resident_rajendra");

        ResponseEntity<?> response = adapterController.getParcelSourceRecords("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testGovernmentOfficerInJurisdiction_Allowed() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer jwt_token_revenue_officer");

        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-000003", request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof GovernmentParcelDTO);

        GovernmentParcelDTO dto = (GovernmentParcelDTO) response.getBody();
        assertEquals("MH-27-PUN-000003", dto.getUlpin());
        assertNotNull(dto.getAiRiskGovernanceEvaluation());
        assertNotNull(dto.getTaxStatus());
    }

    @Test
    public void testUnauthenticatedPublicAccess_PublicDTO() {
        MockHttpServletRequest request = new MockHttpServletRequest(); // No Auth Header

        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof PublicParcelDTO);

        PublicParcelDTO dto = (PublicParcelDTO) response.getBody();
        assertTrue(dto.getOwnerNameMasked().contains("***"));
    }
}
