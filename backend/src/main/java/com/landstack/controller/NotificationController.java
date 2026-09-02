package com.landstack.controller;

import com.landstack.entity.Notification;
import com.landstack.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false, defaultValue = "CITIZEN-001") String userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Notification n = notificationService.markAsRead(id);
        if (n == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(n);
    }

    @PostMapping("/test")
    public ResponseEntity<?> testNotification(@RequestBody Map<String, String> payload) {
        String userId = payload.getOrDefault("userId", "CITIZEN-001");
        String channel = payload.getOrDefault("channel", "SMS"); // IN_APP, EMAIL, SMS, PUSH
        String title = payload.getOrDefault("title", "Test Notification");
        String msg = payload.getOrDefault("message", "Testing multi-channel notification provider");

        Notification n = notificationService.sendNotification(userId, "CASE-TEST", channel, "TEST", title, msg);
        return ResponseEntity.ok(n);
    }
}
