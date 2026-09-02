package com.landstack.identity;

import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Prototype & testing provider for Aadhaar Identity Verification.
 * Used when real UIDAI authorization or credentials are unavailable.
 */
@Component("simulatedAadhaarProvider")
public class SimulatedAadhaarProvider implements AadhaarProvider {

    @Override
    public String getProviderMode() {
        return "SIMULATED";
    }

    @Override
    public boolean isProductionReady() {
        return false;
    }

    @Override
    public Map<String, Object> initiateVerification(String maskedAadhaar, String personId) {
        String txnId = "TXN-UIDAI-SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Map<String, Object> res = new HashMap<>();
        res.put("txnId", txnId);
        res.put("mode", "SIMULATED");
        res.put("status", "OTP_SENT");
        res.put("message", "Simulated OTP sent to registered mobile number linked to Aadhaar");
        res.put("disclaimer", "Mode: SIMULATED — Real UIDAI integration architecture ready");
        return res;
    }

    @Override
    public Map<String, Object> verifyOtp(String txnId, String otp, String personId) {
        Map<String, Object> res = new HashMap<>();

        // Security check: Never accept empty or null OTPs
        if (otp == null || otp.trim().isEmpty()) {
            res.put("verified", false);
            res.put("status", "INVALID_OTP");
            res.put("error", "OTP code cannot be blank.");
            return res;
        }

        // Standard prototype verification
        String targetPersonId = (personId != null && !personId.isEmpty()) ? personId : "LS-PER-00000125";

        res.put("verified", true);
        res.put("status", "VERIFIED");
        res.put("mode", "SIMULATED");
        res.put("personId", targetPersonId);
        res.put("message", "Identity Verified");
        res.put("disclaimer", "Mode: SIMULATED — Land Stack Person ID maintained as application identity");
        return res;
    }
}
