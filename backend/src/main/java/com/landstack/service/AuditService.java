package com.landstack.service;

import com.landstack.entity.AuditLog;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AuditService {

    private final List<AuditLog> auditChain = new CopyOnWriteArrayList<>();
    private String lastHash = "0000000000000000000000000000000000000000000000000000000000000000";

    public AuditService() {
        // Seed initial genesis audit logs for prototype demonstration
        logAction("SYSTEM", "ADMIN", "GOV_ADMIN", "SYSTEM_INITIALIZATION", "SYSTEM", "SYS-001", "GLOBAL-001", "N/A", "System Initialized with Security Hardening", "SUCCESS", "Initial Setup");
        logAction("RESIDENT_01", "LAND_OWNER", "REVENUE", "PARCEL_VIEW", "PARCEL", "MH-27-PUN-000001", "MH-27-PUN-000001", "N/A", "Viewed Owned Parcel Dossier", "SUCCESS", "Authorized Resident Access");
        logAction("REV_OFFICER_01", "REVENUE_OFFICER", "REVENUE", "REVIEW_MUTATION", "MUTATION", "MUT-2025-108", "MH-27-PUN-000001", "SUBMITTED", "FIELD_VERIFICATION", "SUCCESS", "Mutation Review Initiated");
    }

    public synchronized AuditLog logAction(String userId, String role, String department, String action, String resourceType, String resourceId, String ulpin, String previousVal, String newVal, String result, String reason) {
        AuditLog log = new AuditLog();
        log.setId("AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        log.setTimestamp(Instant.now().toString());
        log.setUserId(userId != null ? userId : "ANONYMOUS");
        log.setRole(role != null ? role : "PUBLIC");
        log.setDepartment(department != null ? department : "PUBLIC");
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setUlpin(ulpin);
        log.setPreviousValue(previousVal);
        log.setNewValue(newVal);
        log.setResult(result != null ? result : "SUCCESS");
        log.setReason(reason);
        log.setPreviousHash(lastHash);

        // Calculate SHA-256 hash chain
        String dataToHash = log.getPreviousHash() + "|" + log.getTimestamp() + "|" + log.getUserId() + "|" + log.getAction() + "|" + log.getUlpin() + "|" + log.getResult();
        String currentHash = calculateSha256(dataToHash);
        log.setCurrentHash(currentHash);
        
        lastHash = currentHash;
        auditChain.add(log);

        return log;
    }

    public List<AuditLog> getAuditLogs() {
        return Collections.unmodifiableList(auditChain);
    }

    /**
     * Tamper Evidence Cryptographic Hash Chain Verification.
     * Verifies that each record N's previousHash matches record N-1's currentHash
     * and that record N's currentHash re-computes cleanly.
     */
    public Map<String, Object> verifyIntegrity() {
        String expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";
        int checkedCount = 0;
        AuditLog firstInvalid = null;

        for (AuditLog log : auditChain) {
            checkedCount++;
            if (!log.getPreviousHash().equals(expectedPrevHash)) {
                firstInvalid = log;
                break;
            }

            String recomputedHash = calculateSha256(log.getPreviousHash() + "|" + log.getTimestamp() + "|" + log.getUserId() + "|" + log.getAction() + "|" + log.getUlpin() + "|" + log.getResult());
            if (!recomputedHash.equals(log.getCurrentHash())) {
                firstInvalid = log;
                break;
            }

            expectedPrevHash = log.getCurrentHash();
        }

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("integrityStatus", firstInvalid == null ? "CHAIN_VALID" : "CHAIN_INVALID");
        report.put("checkedRecords", checkedCount);
        report.put("totalRecords", auditChain.size());
        report.put("firstInvalidRecord", firstInvalid);
        report.put("verifiedAt", Instant.now().toString());
        report.put("hashAlgorithm", "SHA-256 Cryptographic Hash Chaining");

        return report;
    }

    private String calculateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return Integer.toHexString(input.hashCode());
        }
    }
}
