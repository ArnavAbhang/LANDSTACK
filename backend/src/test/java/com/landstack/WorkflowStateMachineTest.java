package com.landstack;

import com.landstack.entity.WorkflowCase;
import com.landstack.service.AuditService;
import com.landstack.service.SlaService;
import com.landstack.service.WorkflowCaseService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class WorkflowStateMachineTest {

    @Test
    public void testStateTransitionsAndInvalidRejection() {
        AuditService auditService = new AuditService();
        SlaService slaService = new SlaService();
        WorkflowCaseService service = new WorkflowCaseService(auditService, slaService);

        assertTrue(service.isValidTransition("SUBMITTED", "UNDER_VALIDATION"));
        assertTrue(service.isValidTransition("UNDER_VALIDATION", "ASSIGNED"));
        assertTrue(service.isValidTransition("ASSIGNED", "UNDER_REVIEW"));
        assertTrue(service.isValidTransition("UNDER_REVIEW", "APPROVED"));
        assertTrue(service.isValidTransition("APPROVED", "COMPLETED"));

        // Invalid Transition
        assertFalse(service.isValidTransition("CLOSED", "UNDER_REVIEW"));
        assertFalse(service.isValidTransition("SUBMITTED", "APPROVED"));

        assertThrows(IllegalStateException.class, () -> {
            service.transitionStage("CASE-MUT-001", "APPROVED", "OFFICER", "GOV_OFFICER", "Revenue", "Invalid jump try");
        });
    }
}
