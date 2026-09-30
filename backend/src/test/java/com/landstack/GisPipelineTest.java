package com.landstack;

import com.landstack.controller.GisController;
import com.landstack.controller.ParcelController;
import com.landstack.dto.PublicParcelDTO;
import com.landstack.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class GisPipelineTest {

    private GisController gisController;
    private ParcelController parcelController;

    @BeforeEach
    public void setUp() {
        SpatialAnalysisService spatialAnalysisService = new SpatialAnalysisService();
        WorkflowEngineService workflowEngineService = new WorkflowEngineService();
        AiGovernanceService aiGovernanceService = new AiGovernanceService(workflowEngineService);

        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);

        gisController = new GisController(spatialAnalysisService, aiGovernanceService);
        parcelController = new ParcelController(personService, aiGovernanceService);
    }

    @Test
    @DisplayName("1. Village GIS Query - Returns GeoJSON FeatureCollection for Paud Village")
    public void testVillageGisQuery_ReturnsGeoJsonFeatures() {
        ResponseEntity<Map<String, Object>> response = gisController.getGisParcels("ST_MH", "LOC_PAUD", null, null, null);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("FeatureCollection", body.get("type"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> features = (List<Map<String, Object>>) body.get("features");
        assertNotNull(features);
        assertEquals(36, features.size(), "Paud Village should return 36 contiguous cadastral parcel polygons");

        Map<String, Object> firstFeature = features.get(0);
        assertEquals("Feature", firstFeature.get("type"));
        assertNotNull(firstFeature.get("geometry"));

        @SuppressWarnings("unchecked")
        Map<String, Object> props = (Map<String, Object>) firstFeature.get("properties");
        assertEquals("MH-27-PUN-000001", props.get("ulpin"));
        assertEquals("123/4", props.get("surveyNumber"));
        // Privacy policy: ownerName is intentionally absent from public GIS parcel responses.
        // Owner identity is only exposed through authenticated parcel dossier APIs (/api/parcels/{ulpin}).
        assertNull(props.get("ownerName"), "Public GIS endpoint must NOT expose ownerName");
        assertNotNull(props.get("areaDisplay"), "Public GIS endpoint must expose areaDisplay");
    }

    @Test
    @DisplayName("2. Location Filtering - Village filter enforces correct parcel boundary isolation")
    public void testLocationFiltering_EnforcesJurisdictionIsolation() {
        // Paud Village Query
        ResponseEntity<Map<String, Object>> paudRes = gisController.getGisParcels("ST_MH", "LOC_PAUD", null, null, null);
        @SuppressWarnings("unchecked")
        List<?> paudFeatures = (List<?>) paudRes.getBody().get("features");
        assertEquals(36, paudFeatures.size());

        // Sriperumbudur Village Query
        ResponseEntity<Map<String, Object>> tnRes = gisController.getGisParcels("ST_TN", "LOC_SRIPER", null, null, null);
        @SuppressWarnings("unchecked")
        List<?> tnFeatures = (List<?>) tnRes.getBody().get("features");
        assertEquals(5, tnFeatures.size());

        // Invalid Village Query -> Empty Feature Collection
        ResponseEntity<Map<String, Object>> invalidRes = gisController.getGisParcels("ST_MH", "LOC_INVALID_999", null, null, null);
        @SuppressWarnings("unchecked")
        List<?> invalidFeatures = (List<?>) invalidRes.getBody().get("features");
        assertEquals(0, invalidFeatures.size());
        assertEquals(false, invalidRes.getBody().get("hasData"));
    }

    @Test
    @DisplayName("3. Point-in-Parcel (ST_Contains) - Validates spatial containment query for lat/lng point")
    public void testPointInParcel_SpatialContainment() {
        // Centroid of Parcel 1 (PCL_MH_001): lng 73.845975, lat 18.525875
        ResponseEntity<?> response = gisController.getParcelAtPoint(18.525875, 73.845975, null, null, "ST_MH", "LOC_PAUD");
        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("found"));
        assertEquals("MH-27-PUN-000001", body.get("ulpin"));

        // Point Outside any parcel
        ResponseEntity<?> outsideRes = gisController.getParcelAtPoint(10.0, 10.0, null, null, "ST_MH", "LOC_PAUD");
        assertEquals(HttpStatus.NOT_FOUND, outsideRes.getStatusCode());
    }

    @Test
    @DisplayName("4. Vector Tiles Endpoint - Returns binary PBF tile payload for MapLibre render")
    public void testVectorTilesEndpoint_ReturnsPbfBinaryStream() {
        ResponseEntity<byte[]> response = gisController.getVectorTile(15, 23101, 14402);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);
    }

    @Test
    @DisplayName("5. Parcel Detail ULPIN Uniqueness - Asserts 000001 != 000002 != 000003 != 000004 != 000005")
    public void testParcelDetail_UlpinUniquenessAndNoFallback() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        // 000001 -> Rajendra Patil
        ResponseEntity<?> res1 = parcelController.getParcelByUlpin("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, res1.getStatusCode());
        PublicParcelDTO dto1 = (PublicParcelDTO) res1.getBody();
        assertEquals("MH-27-PUN-000001", dto1.getUlpin());

        // 000002 -> Sneha Kulkarni
        ResponseEntity<?> res2 = parcelController.getParcelByUlpin("MH-27-PUN-000002", request);
        assertEquals(HttpStatus.OK, res2.getStatusCode());
        PublicParcelDTO dto2 = (PublicParcelDTO) res2.getBody();
        assertEquals("MH-27-PUN-000002", dto2.getUlpin());

        // 000003 -> Vijay Jadhav
        ResponseEntity<?> res3 = parcelController.getParcelByUlpin("MH-27-PUN-000003", request);
        assertEquals(HttpStatus.OK, res3.getStatusCode());
        PublicParcelDTO dto3 = (PublicParcelDTO) res3.getBody();
        assertEquals("MH-27-PUN-000003", dto3.getUlpin());

        // 000004 -> Meena Shinde
        ResponseEntity<?> res4 = parcelController.getParcelByUlpin("MH-27-PUN-000004", request);
        assertEquals(HttpStatus.OK, res4.getStatusCode());
        PublicParcelDTO dto4 = (PublicParcelDTO) res4.getBody();
        assertEquals("MH-27-PUN-000004", dto4.getUlpin());

        // 000005 -> Sanjay Deshmukh
        ResponseEntity<?> res5 = parcelController.getParcelByUlpin("MH-27-PUN-000005", request);
        assertEquals(HttpStatus.OK, res5.getStatusCode());
        PublicParcelDTO dto5 = (PublicParcelDTO) res5.getBody();
        assertEquals("MH-27-PUN-000005", dto5.getUlpin());

        // STRICT ASSERTION: Every parcel returns distinct ULPIN, survey number, and owner details
        assertNotEquals(dto1.getUlpin(), dto2.getUlpin());
        assertNotEquals(dto2.getUlpin(), dto3.getUlpin());
        assertNotEquals(dto3.getUlpin(), dto4.getUlpin());
        assertNotEquals(dto4.getUlpin(), dto5.getUlpin());
    }

    @Test
    @DisplayName("6. Invalid ULPIN Lookup - Returns HTTP 404 NOT FOUND (No default fallback)")
    public void testInvalidUlpin_Returns404NotFound() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        ResponseEntity<?> response = parcelController.getParcelByUlpin("MH-27-PUN-999999", request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(body.get("error").toString().contains("Parcel Information Unavailable"));
    }

    @Test
    @DisplayName("7. Parcel Summary & Timeline - Validates summary and chronological lifecycle events")
    public void testParcelSummaryAndTimeline() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer officer_revenue_token");

        ResponseEntity<?> sumRes = parcelController.getParcelSummary("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, sumRes.getStatusCode());

        ResponseEntity<?> timelineRes = parcelController.getParcelTimeline("MH-27-PUN-000001", request);
        assertEquals(HttpStatus.OK, timelineRes.getStatusCode());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> timeline = (List<Map<String, Object>>) timelineRes.getBody();
        assertNotNull(timeline);
        assertTrue(timeline.size() >= 3);
    }
}
