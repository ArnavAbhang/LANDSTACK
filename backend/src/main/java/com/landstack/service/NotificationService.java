package com.landstack.service;

import com.landstack.entity.Notification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {

    private final List<Notification> notifications = new CopyOnWriteArrayList<>();

    public NotificationService() {
        // Seed Initial Notifications
        notifications.add(new Notification("NT-01", "CITIZEN-001", "CASE-MUT-001", "IN_APP", "MUTATION_UPDATE", "Mutation Request Submitted", "Your mutation request for parcel MH-27-PUN-000001 has been submitted.", "DELIVERED"));
        notifications.add(new Notification("NT-02", "CITIZEN-001", "CASE-MUT-001", "SMS", "STAGE_UPDATE", "Officer Assigned", "Your mutation request has been assigned to Revenue Officer Paud.", "SIMULATED"));
        notifications.add(new Notification("NT-03", "CITIZEN-001", "CASE-MUT-001", "EMAIL", "FIELD_VERIFICATION", "Field Verification Scheduled", "Field verification scheduled for parcel MH-27-PUN-000001 on 2026-08-30.", "SIMULATED"));
    }

    public List<Notification> getNotificationsForUser(String userId) {
        if (userId == null || userId.isEmpty()) return Collections.unmodifiableList(notifications);
        List<Notification> res = new ArrayList<>();
        for (Notification n : notifications) {
            if (userId.equalsIgnoreCase(n.getUserId()) || "ALL".equalsIgnoreCase(userId)) {
                res.add(n);
            }
        }
        return res;
    }

    public Notification sendNotification(String userId, String caseId, String channel, String type, String title, String message) {
        String deliveryStatus = "IN_APP".equalsIgnoreCase(channel) ? "DELIVERED" : "SIMULATED";
        Notification n = new Notification("NT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), userId, caseId, channel, type, title, message, deliveryStatus);
        notifications.add(0, n);
        return n;
    }

    public Notification markAsRead(String notificationId) {
        for (Notification n : notifications) {
            if (n.getNotificationId().equalsIgnoreCase(notificationId)) {
                n.setReadAt(new Date().toString());
                return n;
            }
        }
        return null;
    }
}
