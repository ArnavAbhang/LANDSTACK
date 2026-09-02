package com.landstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "land-stack-backend");
        health.put("project", "SIH26014");
        health.put("organization", "Ministry of Rural Development / DoLR");
        health.put("timestamp", Instant.now().toString());
        health.put("modules", Map.of(
            "stateAdapters", "ONLINE",
            "postgisSpatial", "ONLINE",
            "rbacSecurity", "ONLINE",
            "aiGovernance", "CONNECTED"
        ));
        return ResponseEntity.ok(health);
    }
}
