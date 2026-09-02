package com.landstack.controller;

import com.landstack.entity.FieldVerification;
import com.landstack.service.FieldVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/field-verifications")
@CrossOrigin(origins = "*")
public class FieldVerificationController {

    private final FieldVerificationService verificationService;

    @Autowired
    public FieldVerificationController(FieldVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping
    public ResponseEntity<List<FieldVerification>> getFieldVerifications() {
        return ResponseEntity.ok(verificationService.getAllVerifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVerificationById(@PathVariable String id) {
        FieldVerification fv = verificationService.getVerificationById(id);
        if (fv == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(fv);
    }

    @PostMapping
    public ResponseEntity<?> scheduleVerification(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Scheduling field verification requires Government officer authorization."));
        }

        String caseId = payload.getOrDefault("caseId", "CASE-MUT-001");
        String ulpin = payload.getOrDefault("ulpin", "MH-27-PUN-000001");
        String officer = payload.getOrDefault("assignedOfficer", "OFFICER_FIELD_PAUD");
        String obs = payload.getOrDefault("observations", "Scheduled physical cadastral boundary check");

        FieldVerification fv = verificationService.createVerification(caseId, ulpin, officer, obs);
        return ResponseEntity.ok(fv);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeVerification(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Completing field verification requires Government officer authorization."));
        }

        String obs = (String) payload.getOrDefault("observations", "Boundary verification verified cleanly on-site");
        String outcome = (String) payload.getOrDefault("outcome", "VERIFIED");
        Double lat = payload.containsKey("latitude") ? Double.parseDouble(payload.get("latitude").toString()) : 18.5350;
        Double lng = payload.containsKey("longitude") ? Double.parseDouble(payload.get("longitude").toString()) : 73.8550;

        FieldVerification fv = verificationService.completeVerification(id, obs, outcome, lat, lng);
        return ResponseEntity.ok(Map.of("message", "Field verification completed", "verification", fv));
    }
}
