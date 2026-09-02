-- Land Stack Migration V24: Notifications Table

CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    case_id VARCHAR(50),
    channel VARCHAR(20) DEFAULT 'IN_APP', -- IN_APP, EMAIL, SMS, PUSH
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    delivery_status VARCHAR(30) DEFAULT 'DELIVERED', -- DELIVERED, SIMULATED, FAILED, PENDING
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_status ON notifications(delivery_status);
