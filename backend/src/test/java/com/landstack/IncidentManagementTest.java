package com.landstack;

import com.landstack.entity.Incident;
import com.landstack.service.AuditService;
import com.landstack.service.IncidentService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class IncidentManagementTest {

    @Test
    public void testIncidentCreationAndStatusUpdate() {
        AuditService auditService = new AuditService();
        IncidentService service = new IncidentService(auditService);

        Incident inc = service.createIncident("HIGH", "DATABASE_FAILURE", "Test database latency spike", "GOV_ADMIN", "CORR-TEST-99");
        assertNotNull(inc.getIncidentId());
        assertEquals("OPEN", inc.getStatus());

        Incident updated = service.updateIncidentStatus(inc.getIncidentId(), "RESOLVED");
        assertEquals("RESOLVED", updated.getStatus());
        assertNotNull(updated.getResolvedAt());
    }
}
