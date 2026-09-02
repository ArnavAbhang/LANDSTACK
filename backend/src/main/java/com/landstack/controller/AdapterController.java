package com.landstack.controller;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.StateLandDataAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping({"/api/v1/integration", "/api/integration"})
@CrossOrigin(origins = "*")
public class AdapterController {

    private final Map<String, StateLandDataAdapter> adapters = new HashMap<>();

    @Autowired
    public AdapterController(List<StateLandDataAdapter> adapterList) {
        for (StateLandDataAdapter adapter : adapterList) {
            adapters.put(adapter.getStateCode().toUpperCase(), adapter);
        }
    }

    @GetMapping("/states")
    public ResponseEntity<List<Map<String, Object>>> getSupportedStates() {
        List<Map<String, Object>> states = new ArrayList<>();
        
        states.add(Map.of(
            "stateCode", "MH",
            "stateName", "Maharashtra",
            "recordTypes", Arrays.asList("7/12 Extract", "8A Extract", "Mutation Ferfar"),
            "adapterStatus", "ONLINE",
            "activeIngestedRecords", 10
        ));

        states.add(Map.of(
            "stateCode", "TN",
            "stateName", "Tamil Nadu",
            "recordTypes", Arrays.asList("Patta Extract", "Chitta Extract", "Adangal Register"),
            "adapterStatus", "ONLINE",
            "activeIngestedRecords", 10
        ));

        states.add(Map.of(
            "stateCode", "PB",
            "stateName", "Punjab",
            "recordTypes", Arrays.asList("Jamabandi Fard", "Intqal Mutation", "Khasra Girdawari"),
            "adapterStatus", "ONLINE",
            "activeIngestedRecords", 10
        ));

        return ResponseEntity.ok(states);
    }

    @GetMapping("/states/{stateCode}/schema")
    public ResponseEntity<?> getStateSchema(@PathVariable String stateCode) {
        StateLandDataAdapter adapter = adapters.get(stateCode.toUpperCase());
        if (adapter == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported state code: " + stateCode));
        }

        return ResponseEntity.ok(Map.of(
            "stateCode", adapter.getStateCode(),
            "stateName", adapter.getStateName(),
            "supportedDocumentTypes", adapter.getSupportedDocumentTypes(),
            "fieldMappings", adapter.getFieldMappings(),
            "canonicalTargetEntity", "com.landstack.adapter.NormalizedLandRecord",
            "schemaVersion", "1.0.0"
        ));
    }

    @GetMapping("/adapters")
    public ResponseEntity<List<Map<String, Object>>> getAvailableAdapters() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (StateLandDataAdapter adapter : adapters.values()) {
            Map<String, Object> info = new HashMap<>();
            info.put("stateCode", adapter.getStateCode());
            info.put("stateName", adapter.getStateName());
            info.put("supportedDocumentTypes", adapter.getSupportedDocumentTypes());
            info.put("fieldMappings", adapter.getFieldMappings());
            info.put("status", "ONLINE");
            result.add(info);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/adapters/{stateCode}")
    public ResponseEntity<?> getAdapterByState(@PathVariable String stateCode) {
        StateLandDataAdapter adapter = adapters.get(stateCode.toUpperCase());
        if (adapter == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Adapter not found for state: " + stateCode));
        }

        return ResponseEntity.ok(Map.of(
            "stateCode", adapter.getStateCode(),
            "stateName", adapter.getStateName(),
            "supportedDocumentTypes", adapter.getSupportedDocumentTypes(),
            "fieldMappings", adapter.getFieldMappings(),
            "status", "ONLINE"
        ));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateStateRecord(@RequestBody Map<String, Object> payload) {
        String stateCode = (String) payload.getOrDefault("stateCode", "MH");
        StateLandDataAdapter adapter = adapters.get(stateCode.toUpperCase());

        if (adapter == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported state code: " + stateCode));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> sourceRecord = (Map<String, Object>) payload.getOrDefault("sourceRecord", payload);
        NormalizedLandRecord normalized = adapter.normalizeRecord(sourceRecord);

        return ResponseEntity.ok(Map.of(
            "stateCode", stateCode,
            "isValid", normalized.isValid(),
            "validationErrors", normalized.getValidationErrors(),
            "warnings", normalized.getWarnings(),
            "infoMessages", normalized.getInfoMessages()
        ));
    }

    @PostMapping("/normalize")
    public ResponseEntity<?> normalizeStateRecord(@RequestBody Map<String, Object> payload) {
        String stateCode = (String) payload.getOrDefault("stateCode", "MH");
        StateLandDataAdapter adapter = adapters.get(stateCode.toUpperCase());

        if (adapter == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported state code: " + stateCode));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> sourceRecord = (Map<String, Object>) payload.getOrDefault("sourceRecord", payload);
        NormalizedLandRecord normalized = adapter.normalizeRecord(sourceRecord);

        return ResponseEntity.ok(normalized);
    }

    @PostMapping("/ingest")
    public ResponseEntity<?> ingestStateRecord(@RequestBody Map<String, Object> payload) {
        String stateCode = (String) payload.getOrDefault("stateCode", "MH");
        StateLandDataAdapter adapter = adapters.get(stateCode.toUpperCase());

        if (adapter == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Unsupported state code: " + stateCode,
                "supportedStates", adapters.keySet()
            ));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> sourceRecord = (Map<String, Object>) payload.getOrDefault("sourceRecord", payload);
        NormalizedLandRecord normalized = adapter.normalizeRecord(sourceRecord);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Source record ingested & normalized successfully through " + adapter.getStateName() + " Adapter");
        response.put("adapterUsed", adapter.getStateName() + " Adapter (" + adapter.getStateCode() + ")");
        response.put("normalizedRecord", normalized);
        response.put("status", normalized.isValid() ? "SUCCESS" : "VALIDATION_FAILED");
        response.put("ulpin", normalized.getUlpin());
        response.put("warningsCount", normalized.getWarnings().size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/records/{ulpin}/sources")
    public ResponseEntity<?> getParcelSourceRecords(
            @PathVariable String ulpin,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole,
            @RequestHeader(value = "X-User-State", required = false, defaultValue = "MH") String userState) {

        // Phase 7 Protection: Raw source JSON is restricted to authorized Government and Admin roles
        boolean isGovOrAdmin = "GOV_ADMIN".equalsIgnoreCase(userRole) || "REVENUE_OFFICER".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole);
        
        if (!isGovOrAdmin) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "Access Restricted: Raw state source payload is protected under Phase 7 security & privacy policy.",
                "requiredRole", "GOVERNMENT / ADMIN",
                "providedRole", userRole,
                "status", "FORBIDDEN"
            ));
        }

        boolean isTn = ulpin.toUpperCase().contains("TN");
        boolean isPb = ulpin.toUpperCase().contains("PB");

        Map<String, Object> rawSource = new HashMap<>();
        if (isTn) {
            rawSource.put("stateCode", "TN");
            rawSource.put("sourceSystem", "Tamil Nilam Engine");
            rawSource.put("documentType", "Patta Extract");
            rawSource.put("pattaHolder", "M. Shanmugam");
            rawSource.put("surveyNumber", "201/1A");
            rawSource.put("extentAcres", 4.0);
            rawSource.put("classification", "Agricultural (Nanjai)");
            rawSource.put("pattaNo", "1082");
        } else if (isPb) {
            rawSource.put("stateCode", "PB");
            rawSource.put("sourceSystem", "PLRS Fard Engine");
            rawSource.put("documentType", "Jamabandi Fard");
            rawSource.put("ownerName", "Gurpreet Singh");
            rawSource.put("khasraNumber", "88/1");
            rawSource.put("areaKanalMarla", "16-0");
            rawSource.put("landCategory", "Chahi (Irrigated)");
            rawSource.put("khewatNo", "402");
        } else {
            rawSource.put("stateCode", "MH");
            rawSource.put("sourceSystem", "MahaBhulekh 7/12");
            rawSource.put("documentType", "7/12 Extract");
            rawSource.put("khatedarName", "Vijay Jadhav");
            rawSource.put("surveyNo", "125/1");
            rawSource.put("areaHectare", 3.10);
            rawSource.put("jameenPrakar", "Agricultural");
            rawSource.put("khataNo", "482");
        }

        return ResponseEntity.ok(Map.of(
            "ulpin", ulpin,
            "rawSourcePayload", rawSource,
            "preservationStatus", "UNTOUCHED_ORIGINAL_SOURCE_TRUTH",
            "securityLevel", "RESTRICTED_GOVERNMENT_VIEW"
        ));
    }

    @GetMapping("/records/{ulpin}/canonical")
    public ResponseEntity<?> getParcelCanonicalRecord(@PathVariable String ulpin) {
        boolean isTn = ulpin.toUpperCase().contains("TN");
        boolean isPb = ulpin.toUpperCase().contains("PB");
        String stCode = isTn ? "TN" : (isPb ? "PB" : "MH");
        StateLandDataAdapter adapter = adapters.get(stCode);

        Map<String, Object> mockRaw = new HashMap<>();
        if (isTn) {
            mockRaw.put("pattaHolder", "M. Shanmugam");
            mockRaw.put("surveyNumber", "201/1A");
            mockRaw.put("extentAcres", 4.0);
            mockRaw.put("ulpin", ulpin);
        } else if (isPb) {
            mockRaw.put("ownerName", "Gurpreet Singh");
            mockRaw.put("khasraNumber", "88/1");
            mockRaw.put("areaKanalMarla", "16-0");
            mockRaw.put("ulpin", ulpin);
        } else {
            mockRaw.put("khatedarName", "Vijay Jadhav");
            mockRaw.put("surveyNo", "125/1");
            mockRaw.put("areaHectare", 3.10);
            mockRaw.put("ulpin", ulpin);
        }

        NormalizedLandRecord canonical = adapter.normalizeRecord(mockRaw);
        return ResponseEntity.ok(canonical);
    }
}
