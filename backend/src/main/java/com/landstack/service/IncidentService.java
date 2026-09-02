package com.landstack.service;

import com.landstack.entity.Incident;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class IncidentService {

    private final List<Incident> incidents = new CopyOnWriteArrayList<>();
    private final AuditService auditService;

    @Autowired
    public IncidentService(AuditService auditService) {
        this.auditService = auditService;

        // Seed initial Incident
        incidents.add(new Incident("INC-01", "LOW", "INTEGRATION_FAILURE", "Temporary timeout during Tamil Nilam Patta sync retry test.", "GOV_ADMIN", "CORR-INIT-001"));
    }

    public List<Incident> getAllIncidents() {
        return Collections.unmodifiableList(incidents);
    }

    public Incident createIncident(String severity, String category, String description, String assignedTo, String correlationId) {
        Incident inc = new Incident("INC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), severity, category, description, assignedTo, correlationId);
        incidents.add(0, inc);

        auditService.logAction(assignedTo, "GOV_ADMIN", "SYSTEM_OPERATIONS", "INCIDENT_CREATED", "INCIDENT", inc.getIncidentId(), "GLOBAL-OPS", "N/A", "System incident reported: " + description, "WARNING", "System Incident Service");

        return inc;
    }

    public Incident updateIncidentStatus(String incidentId, String status) {
        for (Incident inc : incidents) {
            if (inc.getIncidentId().equalsIgnoreCase(incidentId)) {
                inc.setStatus(status);
                if ("ACKNOWLEDGED".equalsIgnoreCase(status)) inc.setAcknowledgedAt(Instant.now().toString());
                if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) inc.setResolvedAt(Instant.now().toString());
                return inc;
            }
        }
        return null;
    }
}
