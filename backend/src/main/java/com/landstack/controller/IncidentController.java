package com.landstack.controller;

import com.landstack.entity.Incident;
import com.landstack.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getIncidents(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @PostMapping
    public ResponseEntity<?> createIncident(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Creating incident reports requires Government or Admin authorization."));
        }

        String sev = payload.getOrDefault("severity", "MEDIUM");
        String cat = payload.getOrDefault("category", "SYSTEM_DEGRADATION");
        String desc = payload.getOrDefault("description", "System incident reported by operations team");
        String assigned = payload.getOrDefault("assignedTo", "GOV_ADMIN");
        String corrId = payload.getOrDefault("correlationId", "CORR-MANUAL");

        Incident inc = incidentService.createIncident(sev, cat, desc, assigned, corrId);
        return ResponseEntity.ok(inc);
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Updating incident status requires Government or Admin authorization."));
        }

        String status = payload.getOrDefault("status", "RESOLVED");
        Incident inc = incidentService.updateIncidentStatus(id, status);
        if (inc == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(inc);
    }
}
