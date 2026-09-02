package com.landstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/localities")
@CrossOrigin(origins = "*")
public class LocalityController {

    @GetMapping("/states")
    public ResponseEntity<List<Map<String, Object>>> getStates() {
        List<Map<String, Object>> states = Arrays.asList(
            Map.of("id", "ST_MH", "name", "Maharashtra", "code", "MH"),
            Map.of("id", "ST_TN", "name", "Tamil Nadu", "code", "TN"),
            Map.of("id", "ST_PB", "name", "Punjab", "code", "PB")
        );
        return ResponseEntity.ok(states);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<Map<String, Object>>> getDistricts(@RequestParam(defaultValue = "ST_MH") String stateId) {
        if ("ST_TN".equalsIgnoreCase(stateId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "DIST_KANCHI", "stateId", "ST_TN", "name", "Kanchipuram", "code", "KCH"),
                Map.of("id", "DIST_CHNAI", "stateId", "ST_TN", "name", "Chennai", "code", "MAA")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "DIST_PUNE", "stateId", "ST_MH", "name", "Pune", "code", "PUN"),
            Map.of("id", "DIST_THANE", "stateId", "ST_MH", "name", "Thane", "code", "THN")
        ));
    }

    @GetMapping("/talukas")
    public ResponseEntity<List<Map<String, Object>>> getTalukas(@RequestParam(defaultValue = "DIST_PUNE") String districtId) {
        if ("DIST_KANCHI".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_CHE", "districtId", "DIST_KANCHI", "name", "Chengalpattu"),
                Map.of("id", "TAL_SRI", "districtId", "DIST_KANCHI", "name", "Sriperumbudur")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "TAL_MUL", "districtId", "DIST_PUNE", "name", "Mulshi"),
            Map.of("id", "TAL_HAV", "districtId", "DIST_PUNE", "name", "Haveli")
        ));
    }

    @GetMapping("/villages")
    public ResponseEntity<List<Map<String, Object>>> getVillages(@RequestParam(defaultValue = "TAL_MUL") String talukaId) {
        if ("TAL_CHE".equalsIgnoreCase(talukaId) || "TAL_SRI".equalsIgnoreCase(talukaId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "LOC_SRIPER", "talukaId", "TAL_CHE", "villageName", "Sriperumbudur", "lgdCode", "631501"),
                Map.of("id", "LOC_ORAG", "talukaId", "TAL_CHE", "villageName", "Oragadam", "lgdCode", "631502")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "LOC_PAUD", "talukaId", "TAL_MUL", "villageName", "Paud", "lgdCode", "556421"),
            Map.of("id", "LOC_HINJ", "talukaId", "TAL_MUL", "villageName", "Hinjawadi", "lgdCode", "556422")
        ));
    }
}
