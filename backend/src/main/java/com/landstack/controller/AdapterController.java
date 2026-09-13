package com.landstack.controller;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.StateLandDataAdapter;
import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/records/{ulpin}/sources")
    public ResponseEntity<?> getParcelSourceRecords(
            @PathVariable String ulpin,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Access Restricted: Raw state source payloads are restricted to authorized Government Officers.",
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
            rawSource.put("sourceSystem", "PLRS Jamabandi System");
            rawSource.put("documentType", "Jamabandi Fard");
            rawSource.put("khewatNo", "402");
            rawSource.put("ownerName", "Gurpreet Singh");
            rawSource.put("surveyNumber", "88/1");
            rawSource.put("extentKanal", 16.0);
            rawSource.put("classification", "Chahi (Irrigated)");
        } else {
            rawSource.put("stateCode", "MH");
            rawSource.put("sourceSystem", "MahaBhulekh Portal");
            rawSource.put("documentType", "7/12 Extract");
            rawSource.put("khatedarName", "Rajendra Patil");
            rawSource.put("surveyNumber", "123/4");
            rawSource.put("extentHectare", 2.45);
            rawSource.put("classification", "Jirayat Agricultural");
            rawSource.put("khataNo", "482");
        }

        return ResponseEntity.ok(Map.of(
            "ulpin", ulpin,
            "rawSourcePayload", rawSource,
            "accessTier", "GOVERNMENT_RESTRICTED"
        ));
    }
}
