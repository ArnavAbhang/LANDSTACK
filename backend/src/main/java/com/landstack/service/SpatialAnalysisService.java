package com.landstack.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SpatialAnalysisService {

    public Map<String, Object> calculateSpatialRisk(String ulpin) {
        Map<String, Object> response = new HashMap<>();
        boolean isHighRisk = ulpin.contains("MH-27-PUN-002") || ulpin.contains("DEMO-MH-000002");

        double riskScore = isHighRisk ? 0.78 : 0.12;
        String riskLevel = isHighRisk ? "HIGH" : "LOW";

        List<String> reasons = new ArrayList<>();
        if (isHighRisk) {
            reasons.add("Potential Spatial Boundary Conflict (130 m² overlap with survey plot 125/3)");
            reasons.add("Master Plan Reservation Impact (Proposed 30m Ring Road Alignment)");
            reasons.add("Land-Use Mismatch (Zoned Agricultural but NA Residential Structure Detected)");
        } else {
            reasons.add("No adverse spatial boundary or zoning indicators identified.");
        }

        response.put("ulpin", ulpin);
        response.put("riskScore", riskScore);
        response.put("riskLevel", riskLevel);
        response.put("explainabilityReasons", reasons);
        response.put("recommendedAction", isHighRisk
            ? "Priority field survey required prior to mutation approval or title deed transfer."
            : "Clear spatial status; eligible for automated System Clearance Certificate."
        );

        return response;
    }

    public Map<String, Object> compareParcels(String ulpin1, String ulpin2) {
        Map<String, Object> comparison = new HashMap<>();
        
        Map<String, Object> p1 = Map.of(
            "ulpin", ulpin1, "surveyNumber", "123/4", "areaDisplay", "2.45 Hectares",
            "landType", "Agricultural", "zoning", "AG-GEN Zone", "taxStatus", "PAID", "disputeRisk", "LOW"
        );

        Map<String, Object> p2 = Map.of(
            "ulpin", ulpin2, "surveyNumber", "125/3", "areaDisplay", "1.70 Hectares",
            "landType", "Non-Agricultural", "zoning", "R1-RES Zone", "taxStatus", "OVERDUE", "disputeRisk", "HIGH"
        );

        comparison.put("parcel1", p1);
        comparison.put("parcel2", p2);
        comparison.put("spatialRelationship", "Contiguous Adjacent Parcels along Eastern Boundary");
        comparison.put("boundaryConflictDetected", true);
        comparison.put("overlapAreaSqMeters", 130.0);

        return comparison;
    }
}
