package com.landstack.service;

import com.landstack.entity.SlaTracking;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SlaService {

    private final Map<String, Integer> targetHoursPolicy = new LinkedHashMap<>();
    private final Map<String, SlaTracking> slaStore = new ConcurrentHashMap<>();

    public SlaService() {
        // Prototype Configurable Policy Targets (in hours)
        targetHoursPolicy.put("MUTATION_REQUEST", 72);
        targetHoursPolicy.put("LAND_RECORD_CORRECTION", 120);
        targetHoursPolicy.put("FIELD_VERIFICATION", 48);
        targetHoursPolicy.put("PROPERTY_TAX_REQUEST", 72);
        targetHoursPolicy.put("REGISTRATION_VERIFICATION", 48);
        targetHoursPolicy.put("ENCUMBRANCE_VERIFICATION", 48);
        targetHoursPolicy.put("AI_RISK_INVESTIGATION", 24);
        targetHoursPolicy.put("DEFAULT", 72);

        // Seed initial SLA Tracking
        SlaTracking sla1 = new SlaTracking("SLA-01", "CASE-MUT-001", 72, Instant.now().plusSeconds(259200).toString(), "ON_TRACK");
        slaStore.put("CASE-MUT-001", sla1);
    }

    public int getTargetHours(String requestType) {
        if (requestType == null) return targetHoursPolicy.get("DEFAULT");
        return targetHoursPolicy.getOrDefault(requestType.toUpperCase(), targetHoursPolicy.get("DEFAULT"));
    }

    public SlaTracking createSlaForCase(String caseId, String requestType) {
        int hours = getTargetHours(requestType);
        String deadline = Instant.now().plusSeconds(hours * 3600L).toString();
        SlaTracking sla = new SlaTracking("SLA-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), caseId, hours, deadline, "ON_TRACK");
        slaStore.put(caseId, sla);
        return sla;
    }

    public SlaTracking getSlaForCase(String caseId) {
        return slaStore.getOrDefault(caseId, new SlaTracking("SLA-DEFAULT", caseId, 72, Instant.now().plusSeconds(259200).toString(), "ON_TRACK"));
    }

    public SlaTracking escalateCase(String caseId) {
        SlaTracking sla = getSlaForCase(caseId);
        sla.setEscalationLevel(sla.getEscalationLevel() + 1);
        sla.setSlaStatus("AT_RISK");
        return sla;
    }

    public Map<String, Integer> getTargetHoursPolicy() {
        return Collections.unmodifiableMap(targetHoursPolicy);
    }
}
