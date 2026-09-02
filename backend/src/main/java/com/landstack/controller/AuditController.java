package com.landstack.controller;

import com.landstack.entity.AuditLog;
import com.landstack.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditService auditService;

    @Autowired
    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getAuditLogs());
    }

    @GetMapping("/integrity")
    public ResponseEntity<Map<String, Object>> verifyAuditIntegrity() {
        return ResponseEntity.ok(auditService.verifyIntegrity());
    }

    @PostMapping("/simulate-tamper")
    public ResponseEntity<Map<String, Object>> simulateTampering() {
        List<AuditLog> logs = auditService.getAuditLogs();
        if (!logs.isEmpty()) {
            AuditLog target = logs.get(0);
            target.setNewValue("TAMPERED_VAL_" + UUID.randomUUID().toString().substring(0, 4));
        }
        return ResponseEntity.ok(auditService.verifyIntegrity());
    }
}
