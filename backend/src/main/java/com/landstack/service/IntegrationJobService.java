package com.landstack.service;

import com.landstack.entity.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class IntegrationJobService {

    private final List<ExternalDataSource> dataSources = new CopyOnWriteArrayList<>();
    private final List<IntegrationJob> integrationJobs = new CopyOnWriteArrayList<>();
    private final List<GisDataset> gisDatasets = new CopyOnWriteArrayList<>();
    private final List<ParcelVersion> parcelVersions = new CopyOnWriteArrayList<>();

    public IntegrationJobService() {
        // Seed External Data Sources
        dataSources.add(new ExternalDataSource("SRC-01", "MH_MAHABHULEKH", "Maharashtra Revenue & Land Records (MahaBhulekh)", "MH", "Revenue Dept", "LAND_RECORDS", "REST", "READY"));
        dataSources.add(new ExternalDataSource("SRC-02", "TN_TAMILNILAM", "Tamil Nadu Land Records (Tamil Nilam)", "TN", "Revenue Dept", "LAND_RECORDS", "REST", "READY"));
        dataSources.add(new ExternalDataSource("SRC-03", "PB_PLRS_FARD", "Punjab Land Records Society (PLRS Fard)", "PB", "Revenue Dept", "LAND_RECORDS", "REST", "READY"));
        dataSources.add(new ExternalDataSource("SRC-04", "STATE_CADASTRAL_GIS", "State Cadastral Survey GIS Repository", "MH", "Survey & Land Records", "CADASTRAL_GIS", "GEOJSON", "AVAILABLE"));
        dataSources.add(new ExternalDataSource("SRC-05", "SATELLITE_ISRO_BHUVAN", "ISRO Bhuvan High-Res Satellite Imagery", "IN", "NRSC / ISRO", "SATELLITE", "WMTS", "AVAILABLE"));

        // Seed Integration Jobs
        integrationJobs.add(new IntegrationJob("JOB-01", "JOB-MH-2026-001", "MH_MAHABHULEKH", "GEOJSON_IMPORT", 10, 10, 0));
        integrationJobs.add(new IntegrationJob("JOB-02", "JOB-TN-2026-002", "TN_TAMILNILAM", "FULL_SYNC", 10, 10, 1));
        integrationJobs.add(new IntegrationJob("JOB-03", "JOB-PB-2026-003", "PB_PLRS_FARD", "FULL_SYNC", 10, 10, 0));

        // Seed GIS Datasets
        gisDatasets.add(new GisDataset("DS-01", "DS-MH-HAVELI-2026", "Haveli Cadastral Irregular Parcels GeoJSON", "MH_MAHABHULEKH", "MH", "CADASTRAL", 10));
        gisDatasets.add(new GisDataset("DS-02", "DS-TN-KCH-2026", "Kanchipuram Patta Parcel Boundaries GeoJSON", "TN_TAMILNILAM", "TN", "CADASTRAL", 10));

        // Seed Parcel Versions
        parcelVersions.add(new ParcelVersion("VER-01", "MH-PUN-001-V1", "MH-27-PUN-000001", 1, "MahaBhulekh 7/12 Engine", "N/A", "Initial Cadastral Boundary Ingestion"));
        parcelVersions.add(new ParcelVersion("VER-02", "MH-PUN-001-V2", "MH-27-PUN-000001", 2, "Ferfar RoR Engine", "ownerName, areaHectare", "Mutation Ferfar Entry 1902 Approved"));
    }

    public List<ExternalDataSource> getDataSources() { return Collections.unmodifiableList(dataSources); }
    public List<IntegrationJob> getIntegrationJobs() { return Collections.unmodifiableList(integrationJobs); }
    public List<GisDataset> getGisDatasets() { return Collections.unmodifiableList(gisDatasets); }
    public List<ParcelVersion> getParcelVersions() { return Collections.unmodifiableList(parcelVersions); }

    public IntegrationJob createJob(String sourceId, String jobType, Integer recReceived, Integer recSucceeded, Integer warnings) {
        IntegrationJob job = new IntegrationJob("JOB-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), "JOB-" + System.currentTimeMillis(), sourceId, jobType, recReceived, recSucceeded, warnings);
        integrationJobs.add(0, job);
        return job;
    }

    public GisDataset createGisDataset(String datasetName, String sourceId, String stateCode, String datasetType, Integer count) {
        GisDataset ds = new GisDataset("DS-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), "DS-" + System.currentTimeMillis(), datasetName, sourceId, stateCode, datasetType, count);
        gisDatasets.add(0, ds);
        return ds;
    }
}
