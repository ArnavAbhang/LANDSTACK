package com.landstack;

import com.landstack.entity.SlaTracking;
import com.landstack.service.SlaService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SlaTrackingTest {

    @Test
    public void testSlaHoursAndEscalation() {
        SlaService slaService = new SlaService();

        assertEquals(72, slaService.getTargetHours("MUTATION_REQUEST"));
        assertEquals(120, slaService.getTargetHours("LAND_RECORD_CORRECTION"));
        assertEquals(48, slaService.getTargetHours("FIELD_VERIFICATION"));

        SlaTracking sla = slaService.createSlaForCase("CASE-TEST-001", "MUTATION_REQUEST");
        assertEquals("ON_TRACK", sla.getSlaStatus());

        SlaTracking escalated = slaService.escalateCase("CASE-TEST-001");
        assertEquals("AT_RISK", escalated.getSlaStatus());
        assertEquals(1, escalated.getEscalationLevel());
    }
}
