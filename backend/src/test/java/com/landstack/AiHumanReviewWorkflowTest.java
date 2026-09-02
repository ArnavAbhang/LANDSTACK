package com.landstack;

import com.landstack.entity.FieldVerification;
import com.landstack.entity.ServiceRequest;
import com.landstack.service.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AiHumanReviewWorkflowTest {

    @Test
    public void testAiToHumanReviewWorkflow() {
        AuditService auditService = new AuditService();
        SlaService slaService = new SlaService();
        WorkflowCaseService caseService = new WorkflowCaseService(auditService, slaService);
        NotificationService notificationService = new NotificationService();
        ServiceRequestService requestService = new ServiceRequestService(caseService, slaService, notificationService, auditService);
        FieldVerificationService verificationService = new FieldVerificationService();

        // High-risk AI detection creates AI_RISK_INVESTIGATION case requiring human review
        ServiceRequest req = requestService.createRequest("AI_RISK_INVESTIGATION", "AI_GOVERNANCE_ENGINE", "MH-27-PUN-000003", "MH", "PUNE", "HAVELI", "PAUD_001", "Revenue Dept", "High Risk Satellite Structure Footprint Change Detected");
        assertEquals("AI_RISK_INVESTIGATION", req.getRequestType());

        FieldVerification fv = verificationService.createVerification("CASE-" + req.getId(), req.getUlpin(), "OFFICER_FIELD_PAUD", "AI high risk verification required");
        assertNotNull(fv.getVerificationId());
        assertEquals("PENDING", fv.getVerificationStatus());
    }
}
