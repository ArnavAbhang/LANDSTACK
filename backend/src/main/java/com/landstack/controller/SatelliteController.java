package com.landstack.controller;

import com.landstack.entity.SatelliteSource;
import com.landstack.service.SatelliteIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/satellite")
@CrossOrigin(origins = "*")
public class SatelliteController {

    private final SatelliteIntegrationService satelliteIntegrationService;

    @Autowired
    public SatelliteController(SatelliteIntegrationService satelliteIntegrationService) {
        this.satelliteIntegrationService = satelliteIntegrationService;
    }

    @GetMapping("/config")
    public ResponseEntity<List<SatelliteSource>> getSatelliteSources() {
        return ResponseEntity.ok(satelliteIntegrationService.getSatelliteSources());
    }

    @GetMapping("/village/{villageId}")
    public ResponseEntity<Map<String, Object>> getVillageSatelliteExtent(@PathVariable String villageId) {
        return ResponseEntity.ok(satelliteIntegrationService.getVillageBoundingBox(villageId));
    }

    @PostMapping("/change-detection")
    public ResponseEntity<Map<String, Object>> triggerChangeDetection(@RequestBody Map<String, String> payload) {
        String ulpin = payload.getOrDefault("ulpin", "MH-27-PUN-000003");
        return ResponseEntity.ok(satelliteIntegrationService.runSatelliteChangeDetection(ulpin));
    }
}
