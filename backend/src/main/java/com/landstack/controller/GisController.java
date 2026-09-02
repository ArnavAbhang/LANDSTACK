package com.landstack.controller;

import com.landstack.service.SpatialAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/gis")
@CrossOrigin(origins = "*")
public class GisController {

    private final SpatialAnalysisService spatialAnalysisService;

    @Autowired
    public GisController(SpatialAnalysisService spatialAnalysisService) {
        this.spatialAnalysisService = spatialAnalysisService;
    }

    @GetMapping("/parcels")
    public ResponseEntity<Map<String, Object>> getGisParcels(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String villageId,
            @RequestParam(required = false) String bbox,
            @RequestParam(required = false) String landUse,
            @RequestParam(required = false) String risk) {

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");

        List<Map<String, Object>> features = new ArrayList<>();

        if ("ST_TN".equalsIgnoreCase(state) || "LOC_SRIPER".equalsIgnoreCase(villageId) || "LOC_TN_DEMO".equalsIgnoreCase(villageId)) {
            // Tamil Nadu Cadastral Geometries
            double[][][] tnPolygons = {
                {{79.9300, 12.9500}, {79.9325, 12.9495}, {79.9330, 12.9520}, {79.9305, 12.9525}, {79.9300, 12.9500}},
                {{79.9325, 12.9495}, {79.9355, 12.9490}, {79.9360, 12.9515}, {79.9330, 12.9520}, {79.9325, 12.9495}},
                {{79.9355, 12.9490}, {79.9385, 12.9485}, {79.9390, 12.9510}, {79.9360, 12.9515}, {79.9355, 12.9490}},
                {{79.9305, 12.9525}, {79.9330, 12.9520}, {79.9335, 12.9550}, {79.9310, 12.9555}, {79.9305, 12.9525}},
                {{79.9330, 12.9520}, {79.9360, 12.9515}, {79.9365, 12.9545}, {79.9335, 12.9550}, {79.9330, 12.9520}}
            };

            for (int i = 0; i < tnPolygons.length; i++) {
                int pNum = i + 1;
                String pUlpin = String.format("TN-33-KCH-00%d-4412", pNum);
                List<List<Double>> ring = new ArrayList<>();
                for (double[] pt : tnPolygons[i]) {
                    ring.add(Arrays.asList(pt[0], pt[1]));
                }

                features.add(createFeature(
                    "PCL_TN_00" + pNum, pUlpin, "TN-PAR-000" + pNum,
                    "201/" + pNum + "A", "M. Shanmugam", (3.0 + (pNum * 0.5)) + " Acres",
                    "Agricultural (Nanjai)", "Paddy Cultivation", ring.get(0).get(1), ring.get(0).get(0),
                    ring, "VERIFIED", "LOW"
                ));
            }
        } else {
            // 10 Maharashtra Sample Dataset Parcels (Paud, Haveli, Pune)
            double[][][] mhPolygons = {
                // PCL 001 (123/4)
                {{73.84989, 18.53014}, {73.85009, 18.53014}, {73.85010, 18.53029}, {73.84990, 18.53029}, {73.84989, 18.53014}},
                // PCL 002 (124/2)
                {{73.84989, 18.53035}, {73.85012, 18.53039}, {73.85010, 18.53052}, {73.84987, 18.53048}, {73.84989, 18.53035}},
                // PCL 003 (125/1)
                {{73.85020, 18.53017}, {73.85042, 18.53021}, {73.85039, 18.53038}, {73.85017, 18.53034}, {73.85020, 18.53017}},
                // PCL 004 (126/3)
                {{73.84990, 18.53080}, {73.85010, 18.53082}, {73.85009, 18.53095}, {73.84989, 18.53093}, {73.84990, 18.53080}},
                // PCL 005 (127/2)
                {{73.85012, 18.52994}, {73.85035, 18.52990}, {73.85037, 18.53005}, {73.85014, 18.53009}, {73.85012, 18.52994}},
                // PCL 006 (128/1)
                {{73.85042, 18.53048}, {73.85064, 18.53051}, {73.85062, 18.53066}, {73.85040, 18.53063}, {73.85042, 18.53048}},
                // PCL 007 (129/4)
                {{73.84990, 18.53106}, {73.85011, 18.53108}, {73.85009, 18.53121}, {73.84988, 18.53119}, {73.84990, 18.53106}},
                // PCL 008 (130/2)
                {{73.85014, 18.53063}, {73.85038, 18.53066}, {73.85035, 18.53083}, {73.85011, 18.53080}, {73.85014, 18.53063}},
                // PCL 009 (131/1)
                {{73.85040, 18.53080}, {73.85062, 18.53083}, {73.85060, 18.53096}, {73.84990, 18.53093}, {73.85040, 18.53080}},
                // PCL 010 (132/3)
                {{73.85062, 18.53051}, {73.85085, 18.53054}, {73.85082, 18.53072}, {73.85060, 18.53069}, {73.85062, 18.53051}}
            };

            String[] owners = {
                "Rajendra Patil", "Sneha Kulkarni", "Vijay Jadhav", "Meena Shinde", "Sanjay Deshmukh",
                "Pooja Pawar", "Amit Bhosale", "Neha Gaikwad", "Rohit More", "Kavita Chavan"
            };

            String[] surveys = {"123/4", "124/2", "125/1", "126/3", "127/2", "128/1", "129/4", "130/2", "131/1", "132/3"};
            double[] areas = {2.45, 1.82, 3.10, 1.36, 4.20, 2.18, 1.74, 3.65, 2.05, 2.92};
            String[] landTypes = {"Agricultural", "Agricultural", "Agricultural", "Residential", "Agricultural", "Residential", "Commercial", "Agricultural", "Residential", "Agricultural"};

            for (int i = 0; i < mhPolygons.length; i++) {
                int pNum = i + 1;
                String pUlpin = String.format("MH-27-PUN-%06d", pNum);
                List<List<Double>> ring = new ArrayList<>();
                for (double[] pt : mhPolygons[i]) {
                    ring.add(Arrays.asList(pt[0], pt[1]));
                }

                features.add(createFeature(
                    "PCL_MH_" + String.format("%03d", pNum), pUlpin, "MH-PAR-" + String.format("%04d", pNum),
                    surveys[i], owners[i], areas[i] + " Hectares", landTypes[i], landTypes[i],
                    ring.get(0).get(1), ring.get(0).get(0), ring,
                    pNum == 3 ? "MISMATCH_DETECTED" : "VERIFIED", pNum == 3 ? "HIGH" : (pNum == 4 ? "MEDIUM" : "LOW")
                ));
            }
        }

        featureCollection.put("features", features);
        return ResponseEntity.ok(featureCollection);
    }

    @GetMapping("/layers/{layerName}")
    public ResponseEntity<Map<String, Object>> getGisLayer(
            @PathVariable String layerName,
            @RequestParam(required = false, defaultValue = "ST_MH") String state) {

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");
        List<Map<String, Object>> features = new ArrayList<>();

        double baseLat = "ST_TN".equalsIgnoreCase(state) ? 12.9500 : 18.5300;
        double baseLng = "ST_TN".equalsIgnoreCase(state) ? 79.9300 : 73.8500;

        if ("landUse".equalsIgnoreCase(layerName)) {
            features.add(createZoneFeature("LU_AGRI", "Agricultural Zone A1", "Agricultural", baseLat, baseLng, 0.005, "#10b981"));
            features.add(createZoneFeature("LU_RES", "Residential Zone R2", "Residential", baseLat + 0.002, baseLng + 0.002, 0.005, "#3b82f6"));
        } else if ("zoning".equalsIgnoreCase(layerName)) {
            features.add(createZoneFeature("ZON_R1", "Primary Residential Zone R1", "R1-RES", baseLat + 0.001, baseLng + 0.001, 0.004, "#f59e0b"));
        } else if ("masterPlan".equalsIgnoreCase(layerName)) {
            features.add(createZoneFeature("MP_ROAD_30M", "PMRDA Master Plan 30m Ring Road", "Proposed Road", baseLat + 0.001, baseLng, 0.002, "#ec4899"));
        } else if ("restrictions".equalsIgnoreCase(layerName)) {
            features.add(createZoneFeature("RSTR_FLOOD", "Mutha River Flood Risk Zone", "Flood Zone", baseLat + 0.003, baseLng + 0.002, 0.003, "#ef4444"));
        }

        featureCollection.put("features", features);
        return ResponseEntity.ok(featureCollection);
    }

    @GetMapping("/nearby")
    public ResponseEntity<Map<String, Object>> getNearbyFeatures(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false, defaultValue = "500") double radiusMeters) {
        return ResponseEntity.ok(Map.of(
            "center", Map.of("lat", lat, "lng", lng),
            "radiusMeters", radiusMeters,
            "nearbyParcelsCount", 3,
            "nearbyRoads", Arrays.asList("Paud Road (NH-753F)", "PMRDA Proposed 30m Ring Road"),
            "nearbyUtilities", Arrays.asList("MSEDCL 11kV Substation", "PMC 300mm Water Pipeline")
        ));
    }

    private Map<String, Object> createFeature(
            String id, String ulpin, String stateParcelId, String surveyNo, String ownerName,
            String areaDisplay, String landType, String landUse, double lat, double lng,
            List<List<Double>> ringCoordinates, String verStatus, String riskLevel) {

        Map<String, Object> feature = new HashMap<>();
        feature.put("type", "Feature");
        feature.put("id", id);

        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "Polygon");
        geometry.put("coordinates", Collections.singletonList(ringCoordinates));
        feature.put("geometry", geometry);

        Map<String, Object> properties = new HashMap<>();
        properties.put("ulpin", ulpin);
        properties.put("stateParcelId", stateParcelId);
        properties.put("surveyNumber", surveyNo);
        properties.put("ownerName", ownerName);
        properties.put("areaDisplay", areaDisplay);
        properties.put("landType", landType);
        properties.put("landUse", landUse);
        properties.put("latitude", lat);
        properties.put("longitude", lng);
        properties.put("verificationStatus", verStatus);
        properties.put("disputeRisk", riskLevel);
        feature.put("properties", properties);

        return feature;
    }

    private Map<String, Object> createZoneFeature(
            String id, String zoneName, String category, double baseLat, double baseLng, double size, String color) {

        Map<String, Object> feature = new HashMap<>();
        feature.put("type", "Feature");
        feature.put("id", id);

        List<List<Double>> ring = Arrays.asList(
            Arrays.asList(baseLng, baseLat),
            Arrays.asList(baseLng + size, baseLat),
            Arrays.asList(baseLng + size, baseLat + size),
            Arrays.asList(baseLng, baseLat + size),
            Arrays.asList(baseLng, baseLat)
        );

        Map<String, Object> geometry = Map.of("type", "Polygon", "coordinates", Collections.singletonList(ring));
        feature.put("geometry", geometry);

        Map<String, Object> props = Map.of(
            "name", zoneName,
            "category", category,
            "color", color
        );
        feature.put("properties", props);

        return feature;
    }
}
