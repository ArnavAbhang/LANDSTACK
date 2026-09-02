package com.landstack;

import com.landstack.service.AiGovernanceService;
import com.landstack.service.WorkflowEngineService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AiGovernanceTest {

    @Test
    public void testGetAllAlerts() {
        WorkflowEngineService wfService = new WorkflowEngineService();
        AiGovernanceService aiService = new AiGovernanceService(wfService);

        List<Map<String, Object>> alerts = aiService.getAllAlerts();
        assertNotNull(alerts);
        assertTrue(alerts.size() >= 3);
    }

    @Test
    public void testOfficerInvestigateActionTriggersServiceRequest() {
        WorkflowEngineService wfService = new WorkflowEngineService();
        AiGovernanceService aiService = new AiGovernanceService(wfService);

        Map<String, Object> updatedAlert = aiService.processOfficerDecision(
            "ALT_AI_001", "INVESTIGATE", "Tahashildar Haveli", "Field survey ordered."
        );

        assertEquals("INVESTIGATE", updatedAlert.get("status"));
        assertNotNull(updatedAlert.get("linkedRequestId"));

        // Verify ServiceRequest created in Workflow engine
        List<Map<String, Object>> requests = wfService.getAllRequests("REVENUE");
        boolean foundInvReq = requests.stream().anyMatch(r -> "FIELD_VERIFICATION".equals(r.get("requestType")));
        assertTrue(foundInvReq, "Investigate action should automatically generate a Revenue Field Verification request");
    }

    @Test
    public void testParcelRiskSummaryFallback() {
        WorkflowEngineService wfService = new WorkflowEngineService();
        AiGovernanceService aiService = new AiGovernanceService(wfService);

        Map<String, Object> risk = aiService.getParcelRiskSummary("DEMO-MH-000003");
        assertNotNull(risk);
        assertEquals("DEMO-MH-000003", risk.get("ulpin"));
        assertEquals("HIGH", risk.get("riskLevel"));
    }

    @Test
    public void testLandAssistantQuery() {
        WorkflowEngineService wfService = new WorkflowEngineService();
        AiGovernanceService aiService = new AiGovernanceService(wfService);

        Map<String, Object> ans = aiService.queryAssistant("Why is this parcel marked high risk?", "DEMO-MH-000003");
        assertNotNull(ans.get("answer"));
        assertNotNull(ans.get("fact"));
    }
}
