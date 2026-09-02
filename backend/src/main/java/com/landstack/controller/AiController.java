package com.landstack.controller;

import com.landstack.service.AiGovernanceService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<Map<String, Object>>> getAlerts() {
        return ResponseEntity.ok(aiGovernanceService.getAllAlerts());
    }

    @PostMapping("/alerts/{id}/action")
    public ResponseEntity<?> handleOfficerAction(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String action = payload.getOrDefault("action", "INVESTIGATE"); // ACKNOWLEDGE, INVESTIGATE, RESOLVE, DISMISS
        String officer = payload.getOrDefault("officerName", "Authorized Officer");
        String comment = payload.getOrDefault("comment", "Officer decision recorded.");

        try {
            Map<String, Object> updated = aiGovernanceService.processOfficerDecision(id, action, officer, comment);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/parcel-risk/{ulpin}")
    public ResponseEntity<Map<String, Object>> getParcelRisk(@PathVariable String ulpin) {
        return ResponseEntity.ok(aiGovernanceService.getParcelRiskSummary(ulpin));
    }

    @PostMapping("/assistant/query")
    public ResponseEntity<Map<String, Object>> queryAssistant(@RequestBody Map<String, String> payload) {
        String query = payload.getOrDefault("query", "Why is this parcel high risk?");
        String ulpin = payload.getOrDefault("ulpin", "DEMO-MH-000003");
        return ResponseEntity.ok(aiGovernanceService.queryAssistant(query, ulpin));
    }
}
