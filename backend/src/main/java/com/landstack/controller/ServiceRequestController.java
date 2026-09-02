package com.landstack.controller;

import com.landstack.entity.ServiceRequest;
import com.landstack.entity.WorkflowCase;
import com.landstack.service.AuditService;
import com.landstack.service.ServiceRequestService;
import com.landstack.service.WorkflowCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/service-requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    private final ServiceRequestService requestService;
    private final WorkflowCaseService caseService;
    private final AuditService auditService;

    @Autowired
    public ServiceRequestController(ServiceRequestService requestService, WorkflowCaseService caseService, AuditService auditService) {
        this.requestService = requestService;
        this.caseService = caseService;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getServiceRequests(
            @RequestParam(required = false) String requesterId,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("LAND_OWNER".equalsIgnoreCase(userRole) && requesterId != null) {
            return ResponseEntity.ok(requestService.getRequestsForUser(requesterId));
        }
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<?> getServiceRequestById(@PathVariable String requestId) {
        ServiceRequest req = requestService.getRequestById(requestId);
        if (req == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(req);
    }

    @PostMapping
    public ResponseEntity<?> createServiceRequest(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "LAND_OWNER") String userRole,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "CITIZEN-001") String userId) {

        String type = payload.getOrDefault("requestType", "MUTATION_REQUEST");
        String ulpin = payload.getOrDefault("ulpin", "MH-27-PUN-000001");
        String state = payload.getOrDefault("stateCode", "MH");
        String dist = payload.getOrDefault("districtId", "PUNE");
        String taluka = payload.getOrDefault("talukaId", "HAVELI");
        String village = payload.getOrDefault("villageId", "PAUD_001");
        String dept = payload.getOrDefault("department", "Revenue Dept");
        String desc = payload.getOrDefault("description", "Service request submitted by citizen.");

        ServiceRequest req = requestService.createRequest(type, userId, ulpin, state, dist, taluka, village, dept, desc);
        return ResponseEntity.ok(req);
    }

    @PostMapping("/{requestId}/assign")
    public ResponseEntity<?> assignCase(
            @PathVariable String requestId,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Restricted: Case assignment requires Government officer authorization."));
        }

        String officer = payload.getOrDefault("officerId", "OFFICER_REVENUE_PAUD");
        String dept = payload.getOrDefault("department", "Revenue Dept");
        String remarks = payload.getOrDefault("remarks", "Case assigned for jurisdiction officer review");

        WorkflowCase c = caseService.assignOfficer("CASE-" + requestId, officer, dept, "GOV_OFFICER", userRole, remarks);
        return ResponseEntity.ok(Map.of("message", "Case assigned successfully", "case", c));
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<?> approveCase(
            @PathVariable String requestId,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Restricted: Case approval requires Government authorization."));
        }

        String reason = payload != null ? payload.getOrDefault("reason", "Approved after review") : "Approved after review";
        WorkflowCase c = caseService.transitionStage("CASE-" + requestId, "APPROVED", "GOV_OFFICER", userRole, "Revenue Dept", reason);

        return ResponseEntity.ok(Map.of("message", "Service Request Approved", "case", c));
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectCase(
            @PathVariable String requestId,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Restricted: Case rejection requires Government authorization."));
        }

        String reason = payload != null ? payload.getOrDefault("reason", "Rejected due to invalid documents") : "Rejected due to invalid documents";
        WorkflowCase c = caseService.transitionStage("CASE-" + requestId, "REJECTED", "GOV_OFFICER", userRole, "Revenue Dept", reason);

        return ResponseEntity.ok(Map.of("message", "Service Request Rejected", "case", c));
    }

    @PostMapping("/{requestId}/escalate")
    public ResponseEntity<?> escalateCase(
            @PathVariable String requestId,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Restricted: Case escalation requires Government authorization."));
        }

        String reason = payload != null ? payload.getOrDefault("reason", "Escalated due to SLA breach") : "Escalated due to SLA breach";
        WorkflowCase c = caseService.escalateCase("CASE-" + requestId, "GOV_SUPERVISOR", userRole, "Revenue Dept", reason);

        return ResponseEntity.ok(Map.of("message", "Case Escalated to Supervisor", "case", c));
    }
}
