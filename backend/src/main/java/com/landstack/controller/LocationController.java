package com.landstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @GetMapping("/states")
    public ResponseEntity<List<Map<String, Object>>> getStates() {
        List<Map<String, Object>> states = Arrays.asList(
            Map.of("id", "ST_MH", "name", "Maharashtra", "code", "MH"),
            Map.of("id", "ST_TN", "name", "Tamil Nadu", "code", "TN"),
            Map.of("id", "ST_PB", "name", "Punjab", "code", "PB"),
            Map.of("id", "ST_KA", "name", "Karnataka", "code", "KA"),
            Map.of("id", "ST_GJ", "name", "Gujarat", "code", "GJ")
        );
        return ResponseEntity.ok(states);
    }

    @GetMapping("/states/{stateId}/districts")
    public ResponseEntity<List<Map<String, Object>>> getDistrictsByState(@PathVariable String stateId) {
        if ("ST_TN".equalsIgnoreCase(stateId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "DIST_KANCHI", "stateId", "ST_TN", "name", "Kanchipuram", "code", "KCH"),
                Map.of("id", "DIST_CHNAI", "stateId", "ST_TN", "name", "Chennai", "code", "MAA"),
                Map.of("id", "DIST_COIMB", "stateId", "ST_TN", "name", "Coimbatore", "code", "CBE"),
                Map.of("id", "DIST_MADUR", "stateId", "ST_TN", "name", "Madurai", "code", "MDU")
            ));
        } else if ("ST_PB".equalsIgnoreCase(stateId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "DIST_SAS", "stateId", "ST_PB", "name", "SAS Nagar (Mohali)", "code", "MHL"),
                Map.of("id", "DIST_LUDH", "stateId", "ST_PB", "name", "Ludhiana", "code", "LDH"),
                Map.of("id", "DIST_AMRIT", "stateId", "ST_PB", "name", "Amritsar", "code", "ASR"),
                Map.of("id", "DIST_JALAN", "stateId", "ST_PB", "name", "Jalandhar", "code", "JAL")
            ));
        } else if ("ST_KA".equalsIgnoreCase(stateId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "DIST_BLR", "stateId", "ST_KA", "name", "Bengaluru Urban", "code", "BLR"),
                Map.of("id", "DIST_MYS", "stateId", "ST_KA", "name", "Mysuru", "code", "MYS"),
                Map.of("id", "DIST_MNG", "stateId", "ST_KA", "name", "Mangaluru", "code", "IXE")
            ));
        } else if ("ST_GJ".equalsIgnoreCase(stateId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "DIST_AMD", "stateId", "ST_GJ", "name", "Ahmedabad", "code", "AMD"),
                Map.of("id", "DIST_SURAT", "stateId", "ST_GJ", "name", "Surat", "code", "STV"),
                Map.of("id", "DIST_VADO", "stateId", "ST_GJ", "name", "Vadodara", "code", "BDQ")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "DIST_PUNE", "stateId", "ST_MH", "name", "Pune", "code", "PUN"),
            Map.of("id", "DIST_THANE", "stateId", "ST_MH", "name", "Thane", "code", "THN"),
            Map.of("id", "DIST_NAGPUR", "stateId", "ST_MH", "name", "Nagpur", "code", "NGP"),
            Map.of("id", "DIST_NASHIK", "stateId", "ST_MH", "name", "Nashik", "code", "NSK")
        ));
    }

    @GetMapping("/districts/{districtId}/talukas")
    public ResponseEntity<List<Map<String, Object>>> getTalukasByDistrict(@PathVariable String districtId) {
        if ("DIST_KANCHI".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_SRI", "districtId", "DIST_KANCHI", "name", "Sriperumbudur"),
                Map.of("id", "TAL_CHE", "districtId", "DIST_KANCHI", "name", "Chengalpattu")
            ));
        } else if ("DIST_CHNAI".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_EGMORE", "districtId", "DIST_CHNAI", "name", "Egmore"),
                Map.of("id", "TAL_GUINDY", "districtId", "DIST_CHNAI", "name", "Guindy")
            ));
        } else if ("DIST_SAS".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_MHL", "districtId", "DIST_SAS", "name", "Mohali"),
                Map.of("id", "TAL_KHARAR", "districtId", "DIST_SAS", "name", "Kharar")
            ));
        } else if ("DIST_LUDH".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_LUD_E", "districtId", "DIST_LUDH", "name", "Ludhiana East"),
                Map.of("id", "TAL_LUD_W", "districtId", "DIST_LUDH", "name", "Ludhiana West")
            ));
        } else if ("DIST_THANE".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_THANE", "districtId", "DIST_THANE", "name", "Thane Tehsil"),
                Map.of("id", "TAL_KALYAN", "districtId", "DIST_THANE", "name", "Kalyan Tehsil")
            ));
        } else if ("DIST_BLR".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_BLR_N", "districtId", "DIST_BLR", "name", "Bengaluru North"),
                Map.of("id", "TAL_BLR_S", "districtId", "DIST_BLR", "name", "Bengaluru South")
            ));
        } else if ("DIST_AMD".equalsIgnoreCase(districtId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "TAL_AMD_CITY", "districtId", "DIST_AMD", "name", "Ahmedabad City"),
                Map.of("id", "TAL_DASKROI", "districtId", "DIST_AMD", "name", "Daskroi")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "TAL_HAVELI", "districtId", "DIST_PUNE", "name", "Haveli"),
            Map.of("id", "TAL_MUL", "districtId", "DIST_PUNE", "name", "Mulshi"),
            Map.of("id", "TAL_BARAMATI", "districtId", "DIST_PUNE", "name", "Baramati")
        ));
    }

    @GetMapping("/talukas/{talukaId}/villages")
    public ResponseEntity<List<Map<String, Object>>> getVillagesByTaluka(@PathVariable String talukaId) {
        if ("TAL_CHE".equalsIgnoreCase(talukaId) || "TAL_SRI".equalsIgnoreCase(talukaId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "LOC_SRIPER", "talukaId", "TAL_SRI", "villageName", "Sriperumbudur", "lgdCode", "631501"),
                Map.of("id", "LOC_TN_DEMO", "talukaId", "TAL_CHE", "villageName", "Demo Village Kanchipuram", "lgdCode", "631505")
            ));
        } else if ("TAL_HAVELI".equalsIgnoreCase(talukaId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "LOC_PAUD", "talukaId", "TAL_HAVELI", "villageName", "Paud", "lgdCode", "556421"),
                Map.of("id", "LOC_HAVELI", "talukaId", "TAL_HAVELI", "villageName", "Demo Village Haveli", "lgdCode", "556425")
            ));
        } else if ("TAL_MUL".equalsIgnoreCase(talukaId)) {
            return ResponseEntity.ok(Arrays.asList(
                Map.of("id", "LOC_HINJ", "talukaId", "TAL_MUL", "villageName", "Hinjawadi", "lgdCode", "556422"),
                Map.of("id", "LOC_WAKAD", "talukaId", "TAL_MUL", "villageName", "Wakad", "lgdCode", "556423")
            ));
        }
        return ResponseEntity.ok(Arrays.asList(
            Map.of("id", "LOC_PAUD", "talukaId", talukaId, "villageName", "Paud Central", "lgdCode", "556401"),
            Map.of("id", "LOC_GENERIC", "talukaId", talukaId, "villageName", "Sector 1 Locality", "lgdCode", "556402")
        ));
    }
}

