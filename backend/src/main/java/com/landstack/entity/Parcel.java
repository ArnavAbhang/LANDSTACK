package com.landstack.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "parcels")
public class Parcel {

    @Id
    private String id;

    @Column(unique = true, nullable = false, length = 50)
    private String ulpin;

    @Column(name = "state_parcel_id", nullable = false, length = 100)
    private String stateParcelId;

    @Column(name = "state_id", length = 50)
    private String stateId;

    @Column(name = "district_id", length = 50)
    private String districtId;

    @Column(name = "locality_id", length = 50)
    private String localityId;

    @Column(name = "survey_number", nullable = false, length = 100)
    private String surveyNumber;

    @Column(name = "plot_number", length = 50)
    private String plotNumber;

    @Column(name = "area_sq_meters", nullable = false)
    private Double areaSqMeters;

    @Column(name = "area_display", nullable = false, length = 50)
    private String areaDisplay;

    @Column(name = "land_type", nullable = false, length = 50)
    private String landType;

    @Column(name = "land_use", nullable = false, length = 50)
    private String landUse;

    private Double latitude;
    private Double longitude;

    @Column(length = 30)
    private String status = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Parcel() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUlpin() { return ulpin; }
    public void setUlpin(String ulpin) { this.ulpin = ulpin; }

    public String getStateParcelId() { return stateParcelId; }
    public void setStateParcelId(String stateParcelId) { this.stateParcelId = stateParcelId; }

    public String getStateId() { return stateId; }
    public void setStateId(String stateId) { this.stateId = stateId; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getLocalityId() { return localityId; }
    public void setLocalityId(String localityId) { this.localityId = localityId; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public String getPlotNumber() { return plotNumber; }
    public void setPlotNumber(String plotNumber) { this.plotNumber = plotNumber; }

    public Double getAreaSqMeters() { return areaSqMeters; }
    public void setAreaSqMeters(Double areaSqMeters) { this.areaSqMeters = areaSqMeters; }

    public String getAreaDisplay() { return areaDisplay; }
    public void setAreaDisplay(String areaDisplay) { this.areaDisplay = areaDisplay; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getLandUse() { return landUse; }
    public void setLandUse(String landUse) { this.landUse = landUse; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
