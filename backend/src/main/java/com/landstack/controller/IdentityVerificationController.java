package com.landstack.controller;

import com.landstack.identity.AadhaarProvider;
import com.landstack.identity.SimulatedAadhaarProvider;
import com.landstack.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/identity")
@CrossOrigin(origins = "*")
public class IdentityVerificationController {

    private final AadhaarProvider aadhaarProvider;
    private final AuditService auditService;

    // In-memory verification state for prototype session consistency
    private static boolean isVerified = false;
    private static String currentPersonId = "LS-PER-00000125";
    private static String activeTxnId = null;

    @Autowired
    public IdentityVerificationController(
            @Qualifier("simulatedAadhaarProvider") AadhaarProvider aadhaarProvider,
            AuditService auditService) {
        this.aadhaarProvider = aadhaarProvider;
        this.auditService = auditService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getIdentityStatus(
            @RequestParam(required = false, defaultValue = "LS-PER-00000125") String personId) {
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("personId", personId != null ? personId : currentPersonId);
        response.put("verified", isVerified);
        response.put("status", isVerified ? "VERIFIED" : "NOT_VERIFIED");
        response.put("providerMode", aadhaarProvider.getProviderMode());
        response.put("integrationStatus", "Integration Ready");
        response.put("modeLabel", "Mode: SIMULATED");
        response.put("disclaimer", "Mode: SIMULATED — Real UIDAI integration architecture ready");
        
        if (isVerified) {
            response.put("verificationResult", Map.of(
                "label", "Identity Verified ✓",
                "personId", personId != null ? personId : currentPersonId,
                "chain", "Person ID (LS-PER-00000125) → Ownership → ULPIN (MH-27-PUN-000001) → Authorized Properties"
            ));
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/initiate-verification")
    public ResponseEntity<Map<String, Object>> initiateVerification(
            @RequestBody(required = false) Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "usr_res_01") String userId) {
        
        String personId = (body != null && body.containsKey("personId")) ? body.get("personId") : currentPersonId;
        String maskedAadhaar = "XXXX-XXXX-1098"; // Never expose or require raw Aadhaar numbers

        Map<String, Object> initResult = aadhaarProvider.initiateVerification(maskedAadhaar, personId);
        activeTxnId = (String) initResult.get("txnId");

        // Audit verification attempt with SHA-256 chain
        auditService.logAction(
            userId, 
            "RESIDENT", 
            "RESIDENT", 
            "INITIATE_AADHAAR_VERIFICATION", 
            "PERSON", 
            personId, 
            "MH-27-PUN-000001", 
            "NOT_VERIFIED", 
            "OTP_SENT", 
            "SUCCESS", 
            "Initiated optional resident identity verification via SimulatedAadhaarProvider"
        );

        return ResponseEntity.ok(initResult);
    }

    @PostMapping("/confirm-otp")
    public ResponseEntity<Map<String, Object>> confirmOtp(
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "usr_res_01") String userId) {
        
        String txnId = body.getOrDefault("txnId", activeTxnId);
        String otp = body.get("otp");
        String personId = body.getOrDefault("personId", currentPersonId);

        if (otp == null || otp.trim().isEmpty()) {
            auditService.logAction(
                userId, "RESIDENT", "RESIDENT", "VERIFY_AADHAAR_OTP", "PERSON", personId, 
                "MH-27-PUN-000001", "NOT_VERIFIED", "FAILED", "FAILURE", "Blank OTP submitted"
            );
            return ResponseEntity.badRequest().body(Map.of("verified", false, "error", "OTP cannot be empty"));
        }

        Map<String, Object> verifyResult = aadhaarProvider.verifyOtp(txnId, otp, personId);
        boolean success = Boolean.TRUE.equals(verifyResult.get("verified"));

        if (success) {
            isVerified = true;
            currentPersonId = personId;

            // Audit successful verification with SHA-256 chain
            auditService.logAction(
                userId, 
                "RESIDENT", 
                "RESIDENT", 
                "IDENTITY_VERIFIED_SUCCESS", 
                "PERSON", 
                personId, 
                "MH-27-PUN-000001", 
                "NOT_VERIFIED", 
                "VERIFIED", 
                "SUCCESS", 
                "Resident identity verified. Application identity maintained as Person ID " + personId
            );

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("verified", true);
            response.put("status", "VERIFIED");
            response.put("personId", personId);
            response.put("displayText", "Identity Verified ✓");
            response.put("mode", "SIMULATED");
            response.put("chain", Map.of(
                "personId", personId,
                "ownershipStatus", "RESOLVED",
                "ulpin", "MH-27-PUN-000001",
                "authorizedProperties", Arrays.asList("Paud Survey #84/1", "Paud Survey #84/2")
            ));
            response.put("disclaimer", "Mode: SIMULATED — Land Stack Person ID maintained as application identity");

            return ResponseEntity.ok(response);
        } else {
            auditService.logAction(
                userId, "RESIDENT", "RESIDENT", "VERIFY_AADHAAR_OTP", "PERSON", personId, 
                "MH-27-PUN-000001", "NOT_VERIFIED", "FAILED", "FAILURE", "Invalid OTP entered"
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(verifyResult);
        }
    }

    @GetMapping("/high-trust-check")
    public ResponseEntity<Map<String, Object>> checkHighTrustAccess(
            @RequestParam(required = false, defaultValue = "MUTATION_REQUEST") String actionType) {
        
        if (!isVerified) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "status", "FORBIDDEN",
                "code", 403,
                "message", "High-trust action (" + actionType + ") requires Optional Identity Verification.",
                "verificationRequired", true,
                "currentStatus", "NOT_VERIFIED"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "status", "AUTHORIZED",
            "actionType", actionType,
            "personId", currentPersonId,
            "verificationStatus", "VERIFIED"
        ));
    }
}
