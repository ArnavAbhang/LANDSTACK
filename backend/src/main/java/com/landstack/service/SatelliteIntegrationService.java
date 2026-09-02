package com.landstack.service;

import com.landstack.entity.SatelliteSource;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SatelliteIntegrationService {

    private final List<SatelliteSource> satelliteSources = new CopyOnWriteArrayList<>();

    public SatelliteIntegrationService() {
        satelliteSources.add(new SatelliteSource("SAT-01", "ISRO_BHUVAN", "ISRO Bhuvan High-Resolution Orthophoto", "WMTS", "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wmts", "NRSC / ISRO Government of India", "AVAILABLE"));
        satelliteSources.add(new SatelliteSource("SAT-02", "SURVEY_OF_INDIA_RASTER", "Survey of India High-Res Cadastral Drone Imagery", "WMS", "https://soicadastral.gov.in/geoserver/wms", "Survey of India (SoI)", "READY"));
        satelliteSources.add(new SatelliteSource("SAT-03", "PUBLIC_SATELLITE_TILES", "Public Earth Imagery Provider", "XYZ", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", "Esri, Maxar, Earthstar Geographics", "AVAILABLE"));
    }

    public List<SatelliteSource> getSatelliteSources() {
        return Collections.unmodifiableList(satelliteSources);
    }

    public Map<String, Object> getVillageBoundingBox(String villageId) {
        Map<String, Object> bbox = new LinkedHashMap<>();
        bbox.put("villageId", villageId != null ? villageId : "PAUD_001");
        bbox.put("minLat", 18.5200);
        bbox.put("minLng", 73.8400);
        bbox.put("maxLat", 18.5500);
        bbox.put("maxLng", 73.8700);
        bbox.put("centerLat", 18.5350);
        bbox.put("centerLng", 73.8550);
        bbox.put("zoom", 16);
        bbox.put("provider", "ISRO Bhuvan / Earth Raster Imagery");

        return bbox;
    }

    public Map<String, Object> runSatelliteChangeDetection(String ulpin) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("ulpin", ulpin != null ? ulpin : "MH-27-PUN-000003");
        res.put("detectedChange", "Structural Footprint Increase Detected");
        res.put("changedAreaHa", 0.14);
        res.put("confidence", 91);
        res.put("riskLevel", "HIGH");
        res.put("requiresHumanReview", true);
        res.put("suggestedWorkflow", "FIELD_VERIFICATION");
        res.put("disclaimer", "AI-generated satellite decision support. Final determination remains with authorized government officer.");

        return res;
    }
}
