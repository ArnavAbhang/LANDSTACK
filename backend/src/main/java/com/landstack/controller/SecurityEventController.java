package com.landstack.controller;

import com.landstack.entity.SecurityEvent;
import com.landstack.service.JurisdictionAuthorizationService;
import com.landstack.service.SecurityEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class SecurityEventController {

    private final SecurityEventService securityEventService;
    private final JurisdictionAuthorizationService jurisdictionAuthorizationService;

    @Autowired
    public SecurityEventController(SecurityEventService securityEventService, JurisdictionAuthorizationService jurisdictionAuthorizationService) {
        this.securityEventService = securityEventService;
        this.jurisdictionAuthorizationService = jurisdictionAuthorizationService;
    }

    @GetMapping("/events")
    public ResponseEntity<List<SecurityEvent>> getSecurityEvents() {
        return ResponseEntity.ok(securityEventService.getEvents());
    }

    @PostMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "ACKNOWLEDGED");
        boolean updated = securityEventService.updateStatus(id, newStatus);
        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Event status updated to " + newStatus, "eventId", id));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/rbac-matrix")
    public ResponseEntity<Map<String, Set<String>>> getRbacMatrix() {
        return ResponseEntity.ok(jurisdictionAuthorizationService.getRolePermissionsMatrix());
    }
}
