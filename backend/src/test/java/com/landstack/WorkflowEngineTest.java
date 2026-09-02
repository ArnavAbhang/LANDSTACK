package com.landstack;

import com.landstack.service.WorkflowEngineService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class WorkflowEngineTest {

    @Test
    public void testGetAllRequests() {
        WorkflowEngineService service = new WorkflowEngineService();
        List<Map<String, Object>> reqs = service.getAllRequests("REVENUE");

        assertNotNull(reqs);
        assertTrue(reqs.size() >= 1);
        assertEquals("REVENUE", reqs.get(0).get("departmentCode"));
    }

    @Test
    public void testValidTransitionAndAuditLog() {
        WorkflowEngineService service = new WorkflowEngineService();
        Map<String, Object> updated = service.processTransition(
            "REQ-2026-001", "APPROVED", "REVENUE_OFFICER", "Tahashildar Haveli", "Approved mutation."
        );

        assertEquals("APPROVED", updated.get("status"));

        List<Map<String, Object>> audits = service.getAuditLogs();
        assertTrue(audits.stream().anyMatch(a -> "WORKFLOW_TRANSITION_APPROVED".equals(a.get("action"))));
    }

    @Test
    public void testAutoMutationTriggerOnRegistrationApproval() {
        WorkflowEngineService service = new WorkflowEngineService();
        service.processTransition("REQ-2026-002", "APPROVED", "REGISTRATION_OFFICER", "Sub-Registrar", "Deed approved.");

        List<Map<String, Object>> revReqs = service.getAllRequests("REVENUE");
        boolean autoTriggerFound = revReqs.stream().anyMatch(r -> "AUTOMATED_MUTATION".equals(r.get("requestType")));
        assertTrue(autoTriggerFound, "Registration approval should automatically generate a Revenue Mutation request");
    }

    @Test
    public void testInvalidTransitionThrowsException() {
        WorkflowEngineService service = new WorkflowEngineService();
        service.processTransition("REQ-2026-001", "COMPLETED", "REVENUE_OFFICER", "Officer", "Done");

        assertThrows(IllegalStateException.class, () -> {
            service.processTransition("REQ-2026-001", "SUBMITTED", "REVENUE_OFFICER", "Officer", "Restart");
        });
    }

    @Test
    public void testSchemaMappingData() {
        WorkflowEngineService service = new WorkflowEngineService();
        Map<String, Object> mapping = service.getSchemaMapping();

        assertNotNull(mapping.get("maharashtra"));
        assertNotNull(mapping.get("tamilNadu"));
        assertNotNull(mapping.get("punjab"));
    }
}
