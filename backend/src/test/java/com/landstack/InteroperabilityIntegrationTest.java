package com.landstack;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.impl.MaharashtraAdapterImpl;
import com.landstack.adapter.impl.PunjabAdapterImpl;
import com.landstack.adapter.impl.TamilNaduAdapterImpl;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class InteroperabilityIntegrationTest {

    @Test
    public void testMaharashtraAdapterNormalization() {
        MaharashtraAdapterImpl adapter = new MaharashtraAdapterImpl();
        Map<String, Object> raw = Map.of(
            "khatedarName", "Rajendra Patil",
            "surveyNo", "123/4",
            "areaHectare", 2.45,
            "jameenPrakar", "Agricultural"
        );

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("Rajendra Patil", record.getOwnerName());
        assertEquals("123/4", record.getSurveyNumber());
        assertEquals(2.45, record.getNormalizedValue());
        assertEquals("HECTARE", record.getNormalizedUnit());
    }

    @Test
    public void testTamilNaduAdapterUnitNormalization() {
        TamilNaduAdapterImpl adapter = new TamilNaduAdapterImpl();
        Map<String, Object> raw = Map.of(
            "pattaHolder", "M. Shanmugam",
            "surveyNumber", "201/1A",
            "extentAcres", 4.0,
            "classification", "Agricultural (Nanjai)"
        );

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("M. Shanmugam", record.getOwnerName());
        assertEquals(4.0, record.getOriginalValue());
        assertEquals("ACRE", record.getOriginalUnit());
        assertEquals(1.62, record.getNormalizedValue()); // 4.0 * 0.404686
        assertEquals("HECTARE", record.getNormalizedUnit());
        assertFalse(record.getWarnings().isEmpty());
    }

    @Test
    public void testPunjabAdapterUnitNormalization() {
        PunjabAdapterImpl adapter = new PunjabAdapterImpl();
        Map<String, Object> raw = Map.of(
            "ownerName", "Gurpreet Singh",
            "khasraNumber", "88/1",
            "areaKanalMarla", "16-0",
            "landCategory", "Chahi"
        );

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("Gurpreet Singh", record.getOwnerName());
        assertEquals("88/1", record.getSurveyNumber());
        assertEquals("HECTARE", record.getNormalizedUnit());
        assertNotNull(record.getNormalizedValue());
    }
}
