package com.landstack.identity;

import java.util.Map;

/**
 * Abstraction interface for Identity Verification providers.
 * Decouples Land Stack Person ID (e.g. LS-PER-00000125) from underlying Aadhaar keys.
 */
public interface AadhaarProvider {
    String getProviderMode(); // "SIMULATED" or "UIDAI_PRODUCTION"
    boolean isProductionReady();

    /**
     * Initiates identity verification (sends simulated or UIDAI OTP).
     */
    Map<String, Object> initiateVerification(String maskedAadhaar, String personId);

    /**
     * Verifies the OTP and returns verification result.
     * Note: Aadhaar verifies identity; it DOES NOT replace the Land Stack Person ID or ULPIN.
     */
    Map<String, Object> verifyOtp(String txnId, String otp, String personId);
}
