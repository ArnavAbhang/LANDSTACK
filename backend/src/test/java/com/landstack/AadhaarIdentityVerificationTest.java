package com.landstack;

import com.landstack.controller.IdentityVerificationController;
import com.landstack.identity.AadhaarProvider;
import com.landstack.identity.SimulatedAadhaarProvider;
import com.landstack.identity.UIDAIProvider;
import com.landstack.service.AuditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AadhaarIdentityVerificationTest {

    private SimulatedAadhaarProvider simulatedProvider;
    private UIDAIProvider uidaiProvider;
    private AuditService auditService;
    private IdentityVerificationController controller;

    @BeforeEach
    public void setUp() {
        simulatedProvider = new SimulatedAadhaarProvider();
        uidaiProvider = new UIDAIProvider();
        auditService = new AuditService();
        controller = new IdentityVerificationController(simulatedProvider, auditService);
    }

    @Test
    public void testAadhaarProviderAbstractionAndMode() {
        assertEquals("SIMULATED", simulatedProvider.getProviderMode());
        assertFalse(simulatedProvider.isProductionReady());

        assertEquals("UIDAI_PRODUCTION", uidaiProvider.getProviderMode());
        assertTrue(uidaiProvider.isProductionReady());
    }

    @Test
    public void testPersonIdMaintainedAsApplicationIdentity() {
        Map<String, Object> initRes = simulatedProvider.initiateVerification("XXXX-XXXX-1098", "LS-PER-00000125");
        assertEquals("SIMULATED", initRes.get("mode"));
        assertEquals("OTP_SENT", initRes.get("status"));

        Map<String, Object> verifyRes = simulatedProvider.verifyOtp((String) initRes.get("txnId"), "123456", "LS-PER-00000125");
        assertTrue(Boolean.TRUE.equals(verifyRes.get("verified")));
        assertEquals("LS-PER-00000125", verifyRes.get("personId"));
        assertNotEquals("123456", verifyRes.get("personId")); // Aadhaar/OTP must NOT become Person ID
    }

    @Test
    public void testPrototypeTransparencyModeSimulatedLabel() {
        ResponseEntity<Map<String, Object>> statusRes = controller.getIdentityStatus("LS-PER-00000125");
        assertEquals(HttpStatus.OK, statusRes.getStatusCode());
        assertNotNull(statusRes.getBody());
        assertEquals("Mode: SIMULATED", statusRes.getBody().get("modeLabel"));
        assertEquals("Integration Ready", statusRes.getBody().get("integrationStatus"));
    }

    @Test
    public void testHighTrustActionForbiddenWhenUnverified() {
        ResponseEntity<Map<String, Object>> res = controller.checkHighTrustAccess("MUTATION_REQUEST");
        assertEquals(HttpStatus.FORBIDDEN, res.getStatusCode());
        assertNotNull(res.getBody());
        assertEquals("FORBIDDEN", res.getBody().get("status"));
        assertEquals(403, res.getBody().get("code"));
    }

    @Test
    public void testVerificationFlowAndUpdateStatus() {
        ResponseEntity<Map<String, Object>> initRes = controller.initiateVerification(Map.of("personId", "LS-PER-00000125"), "usr_res_01");
        assertEquals(HttpStatus.OK, initRes.getStatusCode());

        String txnId = (String) initRes.getBody().get("txnId");
        ResponseEntity<Map<String, Object>> confirmRes = controller.confirmOtp(Map.of("txnId", txnId, "otp", "123456", "personId", "LS-PER-00000125"), "usr_res_01");
        
        assertEquals(HttpStatus.OK, confirmRes.getStatusCode());
        assertTrue(Boolean.TRUE.equals(confirmRes.getBody().get("verified")));
        assertEquals("Identity Verified ✓", confirmRes.getBody().get("displayText"));

        // Verify high-trust check passes now that identity is verified
        ResponseEntity<Map<String, Object>> highTrustRes = controller.checkHighTrustAccess("MUTATION_REQUEST");
        assertEquals(HttpStatus.OK, highTrustRes.getStatusCode());
        assertEquals("AUTHORIZED", highTrustRes.getBody().get("status"));
    }
}
