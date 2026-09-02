package com.landstack;

import com.landstack.adapter.NormalizedLandRecord;
import com.landstack.adapter.impl.MaharashtraAdapterImpl;
import com.landstack.adapter.impl.TamilNaduAdapterImpl;
import com.landstack.adapter.impl.PunjabAdapterImpl;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ParcelServiceTest {

    @Test
    public void testMaharashtraAdapterNormalization() {
        MaharashtraAdapterImpl adapter = new MaharashtraAdapterImpl();
        Map<String, Object> raw = new HashMap<>();
        raw.put("khatedarName", "Ramesh Anant Kulkarni");
        raw.put("surveyNo", "123/4");
        raw.put("areaHectare", "2.45");
        raw.put("jameenPrakar", "Jirayat");

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("Ramesh Anant Kulkarni", record.getOwnerName());
        assertEquals("123/4", record.getSurveyNumber());
        assertEquals(24500.0, record.getAreaSqMeters());
        assertEquals("MH", record.getStateCode());
    }

    @Test
    public void testTamilNaduAdapterNormalization() {
        TamilNaduAdapterImpl adapter = new TamilNaduAdapterImpl();
        Map<String, Object> raw = new HashMap<>();
        raw.put("pattaHolder", "Demo Owner B");
        raw.put("surveyNumber", "201/1A");
        raw.put("extent", "4.00 Acres");
        raw.put("classification", "Nanjai");

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("Demo Owner B", record.getOwnerName());
        assertEquals("201/1A", record.getSurveyNumber());
        assertTrue(record.getAreaSqMeters() > 16000.0);
        assertEquals("TN", record.getStateCode());
    }

    @Test
    public void testPunjabAdapterNormalization() {
        PunjabAdapterImpl adapter = new PunjabAdapterImpl();
        Map<String, Object> raw = new HashMap<>();
        raw.put("ownerName", "Gurpreet Singh");
        raw.put("khasraNumber", "89/12");
        raw.put("areaKanalMarla", "8 Kanal 0 Marla");
        raw.put("landCategory", "Nehri");

        NormalizedLandRecord record = adapter.normalizeRecord(raw);
        assertTrue(record.isValid());
        assertEquals("Gurpreet Singh", record.getOwnerName());
        assertEquals("89/12", record.getSurveyNumber());
        assertEquals("PB", record.getStateCode());
    }
}
