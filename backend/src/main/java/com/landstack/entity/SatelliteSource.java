package com.landstack.entity;

public class SatelliteSource {
    private String id;
    private String sourceId;
    private String providerName;
    private String tileType = "XYZ"; // XYZ, WMS, WMTS
    private String endpointTemplate;
    private String attribution;
    private Integer minZoom = 0;
    private Integer maxZoom = 22;
    private String status = "AVAILABLE"; // CONNECTED, AVAILABLE, READY, SIMULATED, OFFLINE

    public SatelliteSource() {}

    public SatelliteSource(String id, String sourceId, String providerName, String tileType, String endpointTemplate, String attribution, String status) {
        this.id = id;
        this.sourceId = sourceId;
        this.providerName = providerName;
        this.tileType = tileType;
        this.endpointTemplate = endpointTemplate;
        this.attribution = attribution;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getTileType() { return tileType; }
    public void setTileType(String tileType) { this.tileType = tileType; }

    public String getEndpointTemplate() { return endpointTemplate; }
    public void setEndpointTemplate(String endpointTemplate) { this.endpointTemplate = endpointTemplate; }

    public String getAttribution() { return attribution; }
    public void setAttribution(String attribution) { this.attribution = attribution; }

    public Integer getMinZoom() { return minZoom; }
    public void setMinZoom(Integer minZoom) { this.minZoom = minZoom; }

    public Integer getMaxZoom() { return maxZoom; }
    public void setMaxZoom(Integer maxZoom) { this.maxZoom = maxZoom; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
