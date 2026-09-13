package com.landstack;

import com.landstack.security.AuthPrincipal;
import com.landstack.service.AiGovernanceService;
import com.landstack.service.AuditService;
import com.landstack.service.PersonService;
import com.landstack.service.SecurityEventService;
import com.landstack.service.WorkflowEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ResidentAssistantTest {

    private AiGovernanceService aiGovernanceService;
    private AuditService auditService;
    private SecurityEventService securityEventService;
    private WorkflowEngineService workflowEngineService;
    private PersonService personService;

    @BeforeEach
    void setUp() {
        auditService = new AuditService();
        securityEventService = new SecurityEventService();
        workflowEngineService = new WorkflowEngineService();
        personService = new PersonService(auditService, securityEventService);
        aiGovernanceService = new AiGovernanceService(workflowEngineService, personService, auditService, securityEventService);
    }

    @Test
    void testResidentQueryOwnAuthorizedParcel_Allowed() {
        // Authenticated Resident Rahul Deshmukh (Person ID: LS-PER-00000125, owns MH-27-PUN-000003 & MH-27-PUN-000847)
        AuthPrincipal residentPrincipal = new AuthPrincipal("LS-PER-00000125", "Rahul Deshmukh", "RESIDENT", "PUBLIC", "MH", "Pune", "Haveli", "Paud");

        Map<String, Object> result = aiGovernanceService.queryResidentAssistant(residentPrincipal, "How do I download my 7/12 extract?", "MH-27-PUN-000003");

        assertNotNull(result);
        assertTrue(result.containsKey("answer"));
        String answer = (String) result.get("answer");
        assertTrue(answer.contains("7/12") || answer.contains("RoR") || answer.contains("Paud"));
    }

    @Test
    void testResidentQueryUnauthorizedParcel_Denied() {
        // Resident Rahul Deshmukh attempts to query unauthorized parcel belonging to M. Shanmugam (TN-33-KCH-001-4412)
        AuthPrincipal residentPrincipal = new AuthPrincipal("LS-PER-00000125", "Rahul Deshmukh", "RESIDENT", "PUBLIC", "MH", "Pune", "Haveli", "Paud");

        Map<String, Object> result = aiGovernanceService.queryResidentAssistant(residentPrincipal, "Show me details for this land", "TN-33-KCH-001-4412");

        assertNotNull(result);
        assertEquals(false, result.get("authorized"));
        String answer = (String) result.get("answer");
        assertTrue(answer.contains("do not have registered ownership authorization"));
    }

    @Test
    void testResidentQueryAiRiskScore_BlockedByPrivacyGate() {
        // Resident asks for internal government AI risk score
        AuthPrincipal residentPrincipal = new AuthPrincipal("LS-PER-00000125", "Rahul Deshmukh", "RESIDENT", "PUBLIC", "MH", "Pune", "Haveli", "Paud");

        Map<String, Object> result = aiGovernanceService.queryResidentAssistant(residentPrincipal, "What is my AI risk score?", "MH-27-PUN-000003");

        assertNotNull(result);
        assertEquals(false, result.get("authorized"));
        String answer = (String) result.get("answer");
        assertTrue(answer.contains("Internal land-governance risk assessments are available only to authorized government officials"));
    }

    @Test
    void testGeneralLandTerminologyQuery_Allowed() {
        AuthPrincipal residentPrincipal = new AuthPrincipal("LS-PER-00000125", "Rajendra Patil", "RESIDENT", "PUBLIC", "MH", "Pune", "Haveli", "Paud");

        Map<String, Object> result = aiGovernanceService.queryResidentAssistant(residentPrincipal, "What is the process for Ferfar mutation?", null);

        assertNotNull(result);
        assertTrue(result.containsKey("answer"));
        String answer = (String) result.get("answer");
        assertTrue(answer.contains("Mutation") || answer.contains("Ferfar") || answer.contains("Service Requests"));
    }
}
