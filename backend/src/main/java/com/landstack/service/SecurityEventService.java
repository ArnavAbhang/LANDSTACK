package com.landstack.service;

import com.landstack.entity.SecurityEvent;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SecurityEventService {

    private final List<SecurityEvent> events = new CopyOnWriteArrayList<>();

    public SecurityEventService() {
        // Seed prototype security events
        events.add(new SecurityEvent("SEC-101", "USER_ANON", "PUBLIC", "UNAUTHORIZED_JURISDICTION_ACCESS", "HIGH", "Attempted out-of-jurisdiction access to TN-33-KCH-000001 parcel dossier", "TN-33-KCH-000001"));
        events.add(new SecurityEvent("SEC-102", "OFFICER_PUN_01", "REVENUE_OFFICER", "RAW_SOURCE_ACCESS_DENIED", "MEDIUM", "Officer from Pune Haveli requested Tamil Nadu raw integration payload", "TN-33-KCH-000001"));
    }

    public SecurityEvent logEvent(String userId, String role, String eventType, String severity, String details, String ulpin) {
        SecurityEvent ev = new SecurityEvent("SEC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), userId, role, eventType, severity, details, ulpin);
        events.add(ev);
        return ev;
    }

    public List<SecurityEvent> getEvents() {
        return Collections.unmodifiableList(events);
    }

    public boolean updateStatus(String eventId, String newStatus) {
        for (SecurityEvent ev : events) {
            if (ev.getId().equalsIgnoreCase(eventId)) {
                ev.setStatus(newStatus.toUpperCase());
                return true;
            }
        }
        return false;
    }
}
