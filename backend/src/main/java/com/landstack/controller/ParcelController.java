package com.landstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/parcels")
@CrossOrigin(origins = "*")
public class ParcelController {

    private static final List<Map<String, Object>> PARCELS_DATA = Arrays.asList(
        Map.of("ulpin", "MH-27-PUN-000001", "surveyNo", "123/4", "ownerName", "Rajendra Patil", "areaHectare", 2.45, "landType", "Agricultural", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000002", "surveyNo", "124/2", "ownerName", "Sneha Kulkarni", "areaHectare", 1.82, "landType", "Agricultural", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000003", "surveyNo", "125/1", "ownerName", "Vijay Jadhav", "areaHectare", 3.10, "landType", "Agricultural", "taxStatus", "OVERDUE", "disputeRisk", "HIGH", "disputeSummary", "Civil Suit CS/2024/9912 - Boundary & Title Dispute (130m² overlap)"),
        Map.of("ulpin", "MH-27-PUN-000004", "surveyNo", "126/3", "ownerName", "Meena Shinde", "areaHectare", 1.36, "landType", "Residential", "taxStatus", "PAID", "disputeRisk", "MEDIUM", "disputeSummary", "Satellite change indicator: 0.14 Ha structural footprint change"),
        Map.of("ulpin", "MH-27-PUN-000005", "surveyNo", "127/2", "ownerName", "Sanjay Deshmukh", "areaHectare", 4.20, "landType", "Agricultural", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000006", "surveyNo", "128/1", "ownerName", "Pooja Pawar", "areaHectare", 2.18, "landType", "Residential", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000007", "surveyNo", "129/4", "ownerName", "Amit Bhosale", "areaHectare", 1.74, "landType", "Commercial", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000008", "surveyNo", "130/2", "ownerName", "Neha Gaikwad", "areaHectare", 3.65, "landType", "Agricultural", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000009", "surveyNo", "131/1", "ownerName", "Rohit More", "areaHectare", 2.05, "landType", "Residential", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation"),
        Map.of("ulpin", "MH-27-PUN-000010", "surveyNo", "132/3", "ownerName", "Kavita Chavan", "areaHectare", 2.92, "landType", "Agricultural", "taxStatus", "PAID", "disputeRisk", "LOW", "disputeSummary", "No active civil litigation")
    );

    @GetMapping
    public ResponseEntity<?> getParcels(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false) String bbox,
            @RequestParam(required = false, defaultValue = "PUBLIC") String role) {

        List<Map<String, Object>> content = new ArrayList<>();
        for (Map<String, Object> pd : PARCELS_DATA) {
            String u = (String) pd.get("ulpin");
            Map<String, Object> p = new HashMap<>(pd);
            p.put("ownerName", "PUBLIC".equalsIgnoreCase(role) ? maskName((String) pd.get("ownerName")) : pd.get("ownerName"));
            content.add(p);
        }

        int start = Math.min(page * size, content.size());
        int end = Math.min(start + size, content.size());
        List<Map<String, Object>> pageContent = content.subList(start, end);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("content", pageContent);
        res.put("page", page);
        res.put("size", size);
        res.put("totalElements", content.size());
        res.put("totalPages", (int) Math.ceil((double) content.size() / size));
        res.put("bboxFilterApplied", bbox != null ? bbox : "NONE_VIEWPORT_FULL");

        return ResponseEntity.ok(res);
    }

    @GetMapping("/tiles/{z}/{x}/{y}.pbf")
    public ResponseEntity<?> getVectorTile(
            @PathVariable int z,
            @PathVariable int x,
            @PathVariable int y) {

        Map<String, Object> tileMeta = new LinkedHashMap<>();
        tileMeta.put("tile", z + "/" + x + "/" + y);
        tileMeta.put("format", "MVT_PBF");
        tileMeta.put("status", "ARCHITECTURE_READY");
        tileMeta.put("geometrySimplification", z < 14 ? "SIMPLIFIED_LOW_ZOOM" : "EXACT_CADASTRAL");

        return ResponseEntity.ok(tileMeta);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchParcels(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "PUBLIC") String role) {

        List<Map<String, Object>> results = new ArrayList<>();
        String q = query.trim().toUpperCase();

        if (q.contains("TN") || q.contains("201")) {
            for (int i = 1; i <= 5; i++) {
                String ulpin = "TN-33-KCH-00" + i + "-4412";
                Map<String, Object> p = new HashMap<>();
                p.put("ulpin", ulpin);
                p.put("stateParcelId", "TN-KCH-CHE-DEMO-" + (100 + i));
                p.put("surveyNumber", "201/" + i + "A");
                p.put("state", "Tamil Nadu");
                p.put("district", "Kanchipuram");
                p.put("taluka", "Chengalpattu");
                p.put("village", "Sriperumbudur");
                p.put("areaDisplay", (3.0 + (i * 0.5)) + " Acres");
                p.put("landType", "Agricultural (Nanjai)");
                p.put("ownerName", "PUBLIC".equalsIgnoreCase(role) ? "M. Sh*** (Owner Masked)" : "M. Shanmugam");
                results.add(p);
            }
        } else {
            for (Map<String, Object> pd : PARCELS_DATA) {
                String u = (String) pd.get("ulpin");
                if (q.isEmpty() || u.contains(q) || ((String) pd.get("surveyNo")).contains(q) || ((String) pd.get("ownerName")).toUpperCase().contains(q)) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("ulpin", u);
                    p.put("stateParcelId", "MH-PAR-" + u.substring(u.length() - 4));
                    p.put("surveyNumber", pd.get("surveyNo"));
                    p.put("state", "Maharashtra");
                    p.put("district", "Pune");
                    p.put("taluka", "Haveli");
                    p.put("village", "Paud");
                    p.put("areaDisplay", pd.get("areaHectare") + " Hectares");
                    p.put("landType", pd.get("landType"));
                    p.put("ownerName", "PUBLIC".equalsIgnoreCase(role) ? maskName((String) pd.get("ownerName")) : pd.get("ownerName"));
                    results.add(p);
                }
            }
        }

        return ResponseEntity.ok(results);
    }

    @GetMapping("/{ulpin}/summary")
    public ResponseEntity<?> getParcelSummary(@PathVariable String ulpin) {
        Map<String, Object> summary = new HashMap<>();
        boolean isTn = ulpin.toUpperCase().contains("TN");
        Map<String, Object> target = findParcelData(ulpin);

        summary.put("ulpin", ulpin);
        summary.put("stateParcelId", isTn ? "TN-KCH-CHE-SRI-PATTA-1082" : "MH-PUN-HAV-PAUD-" + target.get("surveyNo"));
        summary.put("state", isTn ? "Tamil Nadu" : "Maharashtra");
        summary.put("district", isTn ? "Kanchipuram" : "Pune");
        summary.put("taluka", isTn ? "Chengalpattu" : "Haveli");
        summary.put("village", isTn ? "Sriperumbudur" : "Paud");
        summary.put("surveyNumber", isTn ? "112/3A" : target.get("surveyNo"));
        summary.put("area", isTn ? 4.00 : target.get("areaHectare"));
        summary.put("areaUnit", isTn ? "Acre" : "Hectare");
        summary.put("landType", isTn ? "Agricultural (Nanjai)" : target.get("landType"));
        summary.put("landUse", isTn ? "Paddy Cultivation" : target.get("landType"));
        summary.put("sourceState", isTn ? "Tamil Nadu" : "Maharashtra");
        summary.put("verificationStatus", "OVERDUE".equals(target.get("taxStatus")) ? "ACTION_REQUIRED" : "SOURCE_VERIFIED");

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{ulpin}/timeline")
    public ResponseEntity<List<Map<String, Object>>> getParcelTimeline(@PathVariable String ulpin) {
        List<Map<String, Object>> timeline = new ArrayList<>();

        if (ulpin.toUpperCase().contains("TN")) {
            timeline.add(Map.of("year", "2011", "event", "Initial Patta Record Created", "type", "PATTA_ISSUED", "details", "Patta No 1082 registered under Tahsildar Chengalpattu"));
            timeline.add(Map.of("year", "2018", "event", "Deed Registration Recorded", "type", "REGISTRATION", "details", "Sale deed REG-KCH-2018-0841 registered at SRO Sriperumbudur"));
            timeline.add(Map.of("year", "2018", "event", "Patta Transfer Approved", "type", "MUTATION", "details", "Patta transfer entry PATTA-TR-2018-402 approved"));
            timeline.add(Map.of("year", "2025", "event", "Property Tax Assessed & Paid", "type", "TAX_PAYMENT", "details", "Receipt TAX-REC-KCH-501 issued"));
        } else {
            timeline.add(Map.of("year", "2014", "event", "Initial 7/12 & 8A Extract Recorded", "type", "ROR_ISSUED", "details", "Khata No 482 registered under Tahsildar Haveli"));
            timeline.add(Map.of("year", "2019", "event", "Co-ownership Ferfar Mutation Recorded", "type", "MUTATION", "details", "Ferfar entry 1902 recorded"));
            timeline.add(Map.of("year", "2020", "event", "Deed Registration Completed", "type", "REGISTRATION", "details", "Sale deed REG-MH-0001 registered at SRO Haveli"));
            if (ulpin.contains("000003") || ulpin.contains("MH-000003")) {
                timeline.add(Map.of("year", "2024", "event", "Civil Suit Filed in Civil Court", "type", "DISPUTE_FILED", "details", "Boundary Suit CS/2024/9912 filed in Pune Court"));
                timeline.add(Map.of("year", "2025", "event", "Property Tax Overdue Notice", "type", "TAX_OVERDUE", "details", "Arrears of ₹8,000.00 flagged by Municipal Tax Dept"));
            }
        }

        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/{ulpin}")
    public ResponseEntity<?> getParcelByUlpin(@PathVariable String ulpin) {
        Map<String, Object> target = findParcelData(ulpin);
        Map<String, Object> parcel = new HashMap<>();

        if (ulpin.toUpperCase().contains("TN")) {
            parcel.put("id", "PCL_TN_001");
            parcel.put("ulpin", ulpin);
            parcel.put("stateParcelId", "TN-KCH-CHE-SRI-PATTA-1082");
            parcel.put("state", "Tamil Nadu");
            parcel.put("district", "Kanchipuram");
            parcel.put("taluka", "Chengalpattu");
            parcel.put("village", "Sriperumbudur");
            parcel.put("surveyNumber", "112/3A");
            parcel.put("areaSqMeters", 16187.0);
            parcel.put("areaDisplay", "4.00 Acres (Nanjai)");
            parcel.put("landType", "Agricultural (Nanjai)");
            parcel.put("landUse", "Paddy Cultivation");
            parcel.put("ownerName", "M. Shanmugam");
            parcel.put("rorType", "Patta & Chitta");
            parcel.put("taxStatus", "PAID");
            parcel.put("taxDues", 0.0);
            parcel.put("disputeRisk", "LOW");
            parcel.put("disputeSummary", "No active civil litigation");
            parcel.put("systemClearance", "CLEAR");
        } else {
            parcel.put("id", "PCL_" + ulpin);
            parcel.put("ulpin", ulpin);
            parcel.put("stateParcelId", "MH-PAR-" + ulpin.substring(Math.max(0, ulpin.length() - 4)));
            parcel.put("state", "Maharashtra");
            parcel.put("district", "Pune");
            parcel.put("taluka", "Haveli");
            parcel.put("village", "Paud");
            parcel.put("surveyNumber", target.get("surveyNo"));
            parcel.put("areaSqMeters", ((Number) target.get("areaHectare")).doubleValue() * 10000.0);
            parcel.put("areaDisplay", target.get("areaHectare") + " Hectares");
            parcel.put("landType", target.get("landType"));
            parcel.put("landUse", target.get("landType"));
            parcel.put("ownerName", target.get("ownerName"));
            parcel.put("rorType", "7/12 Extract & 8A");
            parcel.put("taxStatus", target.get("taxStatus"));
            parcel.put("taxDues", "OVERDUE".equals(target.get("taxStatus")) ? 8000.0 : 0.0);
            parcel.put("disputeRisk", target.get("disputeRisk"));
            parcel.put("disputeSummary", target.get("disputeSummary"));
            parcel.put("systemClearance", "HIGH".equals(target.get("disputeRisk")) ? "FLAGGED_HIGH_RISK" : "SYSTEM_CLEAR");
        }

        return ResponseEntity.ok(parcel);
    }

    private Map<String, Object> findParcelData(String ulpin) {
        for (Map<String, Object> p : PARCELS_DATA) {
            String u = (String) p.get("ulpin");
            if (u.equals(ulpin) || ulpin.endsWith(u.substring(u.length() - 6))) {
                return p;
            }
        }
        return PARCELS_DATA.get(0);
    }

    private String maskName(String name) {
        String[] parts = name.split(" ");
        if (parts.length > 1) {
            return parts[0] + " " + parts[1].substring(0, 1) + "***";
        }
        return name.substring(0, Math.min(2, name.length())) + "***";
    }
}
