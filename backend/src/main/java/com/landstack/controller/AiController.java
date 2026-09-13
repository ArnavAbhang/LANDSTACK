package com.landstack.controller;

import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import com.landstack.service.AiGovernanceService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiGovernanceService aiGovernanceService;

    @Autowired
    public AiController(AiGovernanceService aiGovernanceService) {
        this.aiGovernanceService = aiGovernanceService;
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: AI Governance alerts are restricted to authorized Government Officers."));
        }
        return ResponseEntity.ok(aiGovernanceService.getAllAlerts());
    }

    @PostMapping("/alerts/{id}/action")
    public ResponseEntity<?> handleOfficerAction(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: AI Alert actions are restricted to authorized Government Officers."));
        }

        String action = payload.getOrDefault("action", "INVESTIGATE");
        String officer = principal.getName();
        String comment = payload.getOrDefault("comment", "Officer decision recorded.");

        try {
            Map<String, Object> updated = aiGovernanceService.processOfficerDecision(id, action, officer, comment);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/parcel-risk/{ulpin}")
    public ResponseEntity<?> getParcelRisk(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: AI Risk Governance analysis is restricted to authorized Government Officers."));
        }
        return ResponseEntity.ok(aiGovernanceService.getParcelRiskSummary(ulpin));
    }

    @PostMapping("/assistant/query")
    public ResponseEntity<Map<String, Object>> queryAssistant(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        String query = payload.getOrDefault("query", "Why is this parcel high risk?");
        String ulpin = payload.getOrDefault("ulpin", "MH-27-PUN-000003");
        return ResponseEntity.ok(aiGovernanceService.queryAssistant(query, ulpin));
    }

    @PostMapping("/assistant/resident")
    public ResponseEntity<Map<String, Object>> queryResidentAssistant(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        String message = payload.getOrDefault("message", payload.getOrDefault("query", "How do I download my 7/12 extract?"));
        String ulpin = payload.get("ulpin");

        Map<String, Object> result = aiGovernanceService.queryResidentAssistant(principal, message, ulpin);
        return ResponseEntity.ok(result);
    }
}
