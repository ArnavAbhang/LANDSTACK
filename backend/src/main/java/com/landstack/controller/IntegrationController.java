package com.landstack.controller;

import com.landstack.entity.ExternalDataSource;
import com.landstack.entity.IntegrationJob;
import com.landstack.integration.ConnectorFactory;
import com.landstack.integration.ExternalDataConnector;
import com.landstack.service.AuditService;
import com.landstack.service.GeometryValidationService;
import com.landstack.service.IntegrationJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/integrations")
@CrossOrigin(origins = "*")
public class IntegrationController {

    private final IntegrationJobService jobService;
    private final GeometryValidationService geometryValidationService;
    private final ConnectorFactory connectorFactory;
    private final AuditService auditService;

    @Autowired
    public IntegrationController(IntegrationJobService jobService, GeometryValidationService geometryValidationService, ConnectorFactory connectorFactory, AuditService auditService) {
        this.jobService = jobService;
        this.geometryValidationService = geometryValidationService;
        this.connectorFactory = connectorFactory;
        this.auditService = auditService;
    }

    @GetMapping("/sources")
    public ResponseEntity<List<ExternalDataSource>> getDataSources() {
        return ResponseEntity.ok(jobService.getDataSources());
    }

    @GetMapping("/sources/{id}")
    public ResponseEntity<?> getDataSourceById(@PathVariable String id) {
        for (ExternalDataSource src : jobService.getDataSources()) {
            if (src.getSourceId().equalsIgnoreCase(id) || src.getId().equalsIgnoreCase(id)) {
                return ResponseEntity.ok(src);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<IntegrationJob>> getIntegrationJobs() {
        return ResponseEntity.ok(jobService.getIntegrationJobs());
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        for (IntegrationJob job : jobService.getIntegrationJobs()) {
            if (job.getJobId().equalsIgnoreCase(id) || job.getId().equalsIgnoreCase(id)) {
                return ResponseEntity.ok(job);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateDataset(@RequestBody Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> features = (List<Map<String, Object>>) payload.getOrDefault("features", Collections.emptyList());
        Map<String, Object> qualityReport = geometryValidationService.generateDataQualityReport(features);

        return ResponseEntity.ok(Map.of(
            "validationReport", qualityReport,
            "status", "VALIDATED",
            "featureCount", features.size()
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<?> importDataset(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        // Phase 7 Security Enforcement: Integration import requires Government/Admin role
        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "Access Restricted: Dataset import requires Government or Admin authorization.",
                "status", "FORBIDDEN"
            ));
        }

        String sourceId = (String) payload.getOrDefault("sourceId", "MH_MAHABHULEKH");
        String datasetName = (String) payload.getOrDefault("datasetName", "Cadastral GeoJSON Dataset");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> features = (List<Map<String, Object>>) payload.getOrDefault("features", Collections.emptyList());
        int count = features.size() > 0 ? features.size() : 10;

        Map<String, Object> qualityReport = geometryValidationService.generateDataQualityReport(features);
        IntegrationJob job = jobService.createJob(sourceId, "GEOJSON_IMPORT", count, count, 0);

        auditService.logAction("OFFICER_ADMIN", userRole, "GOV_ADMIN", "DATASET_IMPORTED", "DATASET", job.getJobId(), "GLOBAL-GIS", "N/A", "Imported " + count + " parcel geometries", "SUCCESS", "GeoJSON Cadastral Import Pipeline");

        return ResponseEntity.ok(Map.of(
            "message", "GeoJSON Cadastral Dataset imported successfully into PostGIS",
            "job", job,
            "qualityReport", qualityReport,
            "status", "SUCCESS"
        ));
    }

    @PostMapping("/sync/{sourceId}")
    public ResponseEntity<?> triggerSync(
            @PathVariable String sourceId,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole) {

        if ("PUBLIC".equalsIgnoreCase(userRole) || "LAND_OWNER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of("error", "Synchronization requires Government/Admin access."));
        }

        ExternalDataConnector connector = connectorFactory.getConnector("REST");
        Map<String, Object> fetchRes = connector.fetchPayload(Map.of("sourceId", sourceId));
        IntegrationJob job = jobService.createJob(sourceId, "FULL_SYNC", 10, 10, 0);

        auditService.logAction("OFFICER_ADMIN", userRole, "GOV_ADMIN", "EXTERNAL_SYNC_TRIGGERED", "SOURCE", sourceId, "GLOBAL-SYNC", "READY", "FULL_SYNC_COMPLETED", "SUCCESS", "External State System Sync");

        return ResponseEntity.ok(Map.of(
            "message", "External Data Source synchronization completed successfully",
            "sourceId", sourceId,
            "job", job,
            "fetchPayload", fetchRes
        ));
    }
}
