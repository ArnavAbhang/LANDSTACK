package com.landstack.controller;

import com.landstack.entity.ServiceRequest;
import com.landstack.entity.WorkflowCase;
import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import com.landstack.service.AuditService;
import com.landstack.service.ServiceRequestService;
import com.landstack.service.WorkflowCaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> getServiceRequests(
            @RequestParam(required = false) String requesterId,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (principal.isResident()) {
            return ResponseEntity.ok(requestService.getRequestsForUser(principal.getPersonId()));
        }
        if (principal.isGovernment() || principal.isAdmin()) {
            return ResponseEntity.ok(requestService.getAllRequests());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", "Access Denied: Unauthenticated access to service requests."));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<?> getServiceRequestById(@PathVariable String requestId, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        ServiceRequest req = requestService.getRequestById(requestId);
        if (req == null) return ResponseEntity.notFound().build();

        if (principal.isResident() && !principal.getPersonId().equalsIgnoreCase(req.getRequesterId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: Citizens can only access their own service requests."));
        }
        return ResponseEntity.ok(req);
    }

    @PostMapping
    public ResponseEntity<?> createServiceRequest(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (principal.isPublic()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Denied: Unauthenticated user cannot create service request."));
        }

        String type = payload.getOrDefault("requestType", "MUTATION_REQUEST");
        String ulpin = payload.getOrDefault("ulpin", "MH-27-PUN-000001");
        String state = payload.getOrDefault("stateCode", "MH");
        String dist = payload.getOrDefault("districtId", "PUNE");
        String taluka = payload.getOrDefault("talukaId", "HAVELI");
        String village = payload.getOrDefault("villageId", "PAUD_001");
        String dept = payload.getOrDefault("department", "Revenue Dept");
        String desc = payload.getOrDefault("description", "Service request submitted by citizen.");

        ServiceRequest req = requestService.createRequest(type, principal.getPersonId(), ulpin, state, dist, taluka, village, dept, desc);
        return ResponseEntity.ok(req);
    }

    @PostMapping("/{requestId}/assign")
    public ResponseEntity<?> assignCase(
            @PathVariable String requestId,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Restricted: Case assignment requires Government officer authorization."));
        }

        String officer = payload.getOrDefault("officerId", "OFFICER_REVENUE_PAUD");
        String dept = payload.getOrDefault("department", "Revenue Dept");
        String remarks = payload.getOrDefault("remarks", "Case assigned for jurisdiction officer review");

        WorkflowCase c = caseService.assignOfficer("CASE-" + requestId, officer, dept, "GOV_OFFICER", principal.getRole(), remarks);
        return ResponseEntity.ok(Map.of("message", "Case assigned successfully", "case", c));
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<?> approveCase(
            @PathVariable String requestId,
            @RequestBody(required = false) Map<String, String> payload,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Restricted: Case approval requires Government authorization."));
        }

        String reason = payload != null ? payload.getOrDefault("reason", "Approved after review") : "Approved after review";
        WorkflowCase c = caseService.transitionStage("CASE-" + requestId, "APPROVED", "GOV_OFFICER", principal.getRole(), "Revenue Dept", reason);

        return ResponseEntity.ok(Map.of("message", "Service Request Approved", "case", c));
    }
}
