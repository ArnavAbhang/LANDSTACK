package com.landstack.controller;

import com.landstack.service.WorkflowEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WorkflowController {

    private final WorkflowEngineService workflowEngineService;

    @Autowired
    public WorkflowController(WorkflowEngineService workflowEngineService) {
        this.workflowEngineService = workflowEngineService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Map<String, Object>>> getDepartments() {
        List<Map<String, Object>> depts = Arrays.asList(
            Map.of("code", "REVENUE", "name", "Department of Land Revenue", "officersCount", 14),
            Map.of("code", "REGISTRATION", "name", "Department of Registration & Stamps", "officersCount", 8),
            Map.of("code", "TAX", "name", "Municipal Land Tax Department", "officersCount", 6),
            Map.of("code", "URBAN_PLANNING", "name", "Urban Development & Master Planning", "officersCount", 5),
            Map.of("code", "WATER", "name", "Water Supply & Sewerage Board", "officersCount", 4),
            Map.of("code", "ELECTRICITY", "name", "State Power Distribution Corporation", "officersCount", 4),
            Map.of("code", "DISPUTE", "name", "Land Disputes & Revenue Court", "officersCount", 3)
        );
        return ResponseEntity.ok(depts);
    }

    @GetMapping("/service-requests")
    public ResponseEntity<List<Map<String, Object>>> getServiceRequests(@RequestParam(required = false) String department) {
        return ResponseEntity.ok(workflowEngineService.getAllRequests(department));
    }

    @PostMapping("/workflows/{id}/transition")
    public ResponseEntity<?> transitionWorkflow(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String nextState = payload.get("nextState");
            String actorRole = payload.getOrDefault("actorRole", "REVENUE_OFFICER");
            String actorName = payload.getOrDefault("actorName", "Officer User");
            String comments = payload.getOrDefault("comments", "State transition processed.");

            Map<String, Object> updated = workflowEngineService.processTransition(id, nextState, actorRole, actorName, comments);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "INVALID_WORKFLOW_TRANSITION",
                "message", e.getMessage(),
                "timestamp", Instant.now().toString()
            ));
        }
    }

    @GetMapping("/audit")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        return ResponseEntity.ok(workflowEngineService.getAuditLogs());
    }

    @GetMapping("/schema-mapping")
    public ResponseEntity<Map<String, Object>> getSchemaMapping() {
        return ResponseEntity.ok(workflowEngineService.getSchemaMapping());
    }

    @PostMapping("/documents/verify")
    public ResponseEntity<?> verifyDocument(@RequestBody Map<String, Object> payload) {
        String docId = (String) payload.getOrDefault("documentId", "DOC_001");
        String ulpin = (String) payload.getOrDefault("ulpin", "MH-27-PUN-001-8472");
        String status = (String) payload.getOrDefault("status", "VERIFIED");
        String officer = (String) payload.getOrDefault("officer", "Verification Officer");

        workflowEngineService.addAudit(officer, "GOVERNMENT_OFFICER", "DOCUMENTATION", "VERIFIED_DOCUMENT", ulpin, "PENDING", status);

        return ResponseEntity.ok(Map.of(
            "documentId", docId,
            "ulpin", ulpin,
            "status", status,
            "verifiedBy", officer,
            "verifiedAt", Instant.now().toString()
        ));
    }
}
