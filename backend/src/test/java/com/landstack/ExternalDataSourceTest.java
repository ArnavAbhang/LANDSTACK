package com.landstack;

import com.landstack.entity.ExternalDataSource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ExternalDataSourceTest {

    @Test
    public void testExternalDataSourceStatusClassification() {
        ExternalDataSource ds1 = new ExternalDataSource("SRC-01", "MH_MAHABHULEKH", "MahaBhulekh 7/12", "MH", "Revenue Dept", "LAND_RECORDS", "REST", "READY");
        assertEquals("READY", ds1.getStatus());

        ExternalDataSource ds2 = new ExternalDataSource("SRC-02", "STATE_GIS", "State Cadastral GIS", "MH", "Survey Dept", "CADASTRAL_GIS", "GEOJSON", "SIMULATED");
        assertEquals("SIMULATED", ds2.getStatus());

        ExternalDataSource ds3 = new ExternalDataSource("SRC-03", "ISRO_BHUVAN", "ISRO Bhuvan Satellite Tiles", "IN", "ISRO", "SATELLITE", "WMTS", "AVAILABLE");
        assertEquals("AVAILABLE", ds3.getStatus());
    }
}
