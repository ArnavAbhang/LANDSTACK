package com.landstack.entity;

import java.time.Instant;

public class Notification {
    private String notificationId;
    private String userId;
    private String caseId;
    private String channel = "IN_APP"; // IN_APP, EMAIL, SMS, PUSH
    private String notificationType;
    private String title;
    private String message;
    private String deliveryStatus = "DELIVERED"; // DELIVERED, SIMULATED, FAILED, PENDING
    private String createdAt = Instant.now().toString();
    private String deliveredAt = Instant.now().toString();
    private String readAt;

    public Notification() {}

    public Notification(String notificationId, String userId, String caseId, String channel, String notificationType, String title, String message, String deliveryStatus) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.caseId = caseId;
        this.channel = channel;
        this.notificationType = notificationType;
        this.title = title;
        this.message = message;
        this.deliveryStatus = deliveryStatus;
    }

    public String getNotificationId() { return notificationId; }
    public void setNotificationId(String notificationId) { this.notificationId = notificationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getReadAt() { return readAt; }
    public void setReadAt(String readAt) { this.readAt = readAt; }
}
