package com.landstack.controller;

import com.landstack.entity.GisDataset;
import com.landstack.service.CrsTransformationService;
import com.landstack.service.IntegrationJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/gis")
@CrossOrigin(origins = "*")
public class GisDatasetController {

    private final IntegrationJobService jobService;
    private final CrsTransformationService crsTransformationService;

    @Autowired
    public GisDatasetController(IntegrationJobService jobService, CrsTransformationService crsTransformationService) {
        this.jobService = jobService;
        this.crsTransformationService = crsTransformationService;
    }

    @GetMapping("/datasets")
    public ResponseEntity<List<GisDataset>> getDatasets() {
        return ResponseEntity.ok(jobService.getGisDatasets());
    }

    @GetMapping("/crs")
    public ResponseEntity<Map<String, String>> getSupportedCrs() {
        return ResponseEntity.ok(crsTransformationService.getSupportedCrs());
    }
}
