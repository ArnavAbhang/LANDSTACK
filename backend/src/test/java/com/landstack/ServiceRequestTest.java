package com.landstack;

import com.landstack.entity.ServiceRequest;
import com.landstack.service.*;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ServiceRequestTest {

    @Test
    public void testServiceRequestCreationAndUserFiltering() {
        AuditService auditService = new AuditService();
        SlaService slaService = new SlaService();
        WorkflowCaseService caseService = new WorkflowCaseService(auditService, slaService);
        NotificationService notificationService = new NotificationService();
        ServiceRequestService requestService = new ServiceRequestService(caseService, slaService, notificationService, auditService);

        ServiceRequest req = requestService.createRequest("MUTATION_REQUEST", "CITIZEN-001", "MH-27-PUN-000001", "MH", "PUNE", "HAVELI", "PAUD_001", "Revenue Dept", "Test mutation request");
        assertNotNull(req.getId());
        assertEquals("SUBMITTED", req.getStatus());

        List<ServiceRequest> userReqs = requestService.getRequestsForUser("CITIZEN-001");
        assertTrue(userReqs.size() >= 1);
    }
}
