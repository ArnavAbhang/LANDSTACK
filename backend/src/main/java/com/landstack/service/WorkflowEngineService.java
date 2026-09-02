package com.landstack.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class WorkflowEngineService {

    private final List<Map<String, Object>> serviceRequests = new ArrayList<>();
    private final List<Map<String, Object>> auditLogs = new ArrayList<>();
    private final List<Map<String, Object>> workflowHistory = new ArrayList<>();

    public WorkflowEngineService() {
        // Initialize Demo Workflows with LAND_STACK_SIH26014_Demo_Data
        Map<String, Object> req1 = new HashMap<>();
        req1.put("id", "REQ-2026-001");
        req1.put("ulpin", "MH-27-PUN-000001");
        req1.put("applicantName", "Rajendra Patil");
        req1.put("requestType", "MUTATION_REQUEST");
        req1.put("departmentCode", "REVENUE");
        req1.put("status", "UNDER_REVIEW");
        req1.put("assignedOfficer", "Tahashildar Haveli");
        req1.put("priority", "HIGH");
        req1.put("details", "Co-ownership Ferfar Mutation under Mutation Entry No 1902.");
        req1.put("createdAt", Instant.now().minusSeconds(7200).toString());
        serviceRequests.add(req1);

        Map<String, Object> req2 = new HashMap<>();
        req2.put("id", "REQ-2026-002");
        req2.put("ulpin", "MH-27-PUN-000003");
        req2.put("applicantName", "Vijay Jadhav");
        req2.put("requestType", "OWNERSHIP_TRANSFER");
        req2.put("departmentCode", "REGISTRATION");
        req2.put("status", "APPROVAL_PENDING");
        req2.put("assignedOfficer", "Sub-Registrar Haveli");
        req2.put("priority", "HIGH");
        req2.put("details", "Deed Registration REG-MH-0002 pending interdepartmental revenue trigger.");
        req2.put("createdAt", Instant.now().minusSeconds(3600).toString());
        serviceRequests.add(req2);

        // Initial Audit Logs
        addAudit("usr_reg_01", "REGISTRATION_OFFICER", "REGISTRATION", "VERIFIED_DEED", "MH-27-PUN-000001", "DRAFT", "VERIFIED");
        addAudit("usr_rev_01", "REVENUE_OFFICER", "REVENUE", "CREATED_MUTATION_TRIGGER", "MH-27-PUN-000003", "NONE", "PENDING_APPROVAL");
    }

    public List<Map<String, Object>> getAllRequests(String department) {
        if (department == null || department.isEmpty() || "ALL".equalsIgnoreCase(department)) {
            return serviceRequests;
        }
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> req : serviceRequests) {
            if (department.equalsIgnoreCase((String) req.get("departmentCode"))) {
                filtered.add(req);
            }
        }
        return filtered;
    }

    public Map<String, Object> processTransition(String requestId, String nextState, String actorRole, String actorName, String comments) {
        Map<String, Object> targetReq = null;
        for (Map<String, Object> req : serviceRequests) {
            if (requestId.equals(req.get("id"))) {
                targetReq = req;
                break;
            }
        }

        if (targetReq == null) {
            throw new IllegalArgumentException("Service request not found: " + requestId);
        }

        String currentState = (String) targetReq.get("status");
        validateStateTransition(currentState, nextState);

        targetReq.put("status", nextState);
        targetReq.put("updatedAt", Instant.now().toString());

        String ulpin = (String) targetReq.get("ulpin");

        // Record Workflow State Change
        Map<String, Object> wfStep = new HashMap<>();
        wfStep.put("id", "WF_" + UUID.randomUUID().toString().substring(0, 8));
        wfStep.put("requestId", requestId);
        wfStep.put("ulpin", ulpin);
        wfStep.put("currentState", nextState);
        wfStep.put("previousState", currentState);
        wfStep.put("actorRole", actorRole);
        wfStep.put("actorName", actorName);
        wfStep.put("comments", comments);
        wfStep.put("timestamp", Instant.now().toString());
        workflowHistory.add(wfStep);

        // Record Audit Log
        addAudit(actorName, actorRole, (String) targetReq.get("departmentCode"), "WORKFLOW_TRANSITION_" + nextState, ulpin, currentState, nextState);

        // Interdepartmental Trigger: REGISTRATION -> MUTATION -> ROR -> TAX
        if ("REGISTRATION".equalsIgnoreCase((String) targetReq.get("departmentCode")) && "APPROVED".equalsIgnoreCase(nextState)) {
            triggerAutoMutationRequest(ulpin, actorName);
        }

        return targetReq;
    }

    private void triggerAutoMutationRequest(String ulpin, String actorName) {
        Map<String, Object> autoMutation = new HashMap<>();
        String newReqId = "REQ-2026-" + (serviceRequests.size() + 101);
        autoMutation.put("id", newReqId);
        autoMutation.put("ulpin", ulpin);
        autoMutation.put("applicantName", "System Auto-Trigger (Registration Approval)");
        autoMutation.put("requestType", "AUTOMATED_MUTATION");
        autoMutation.put("departmentCode", "REVENUE");
        autoMutation.put("status", "SUBMITTED");
        autoMutation.put("assignedOfficer", "Revenue Inspector Haveli");
        autoMutation.put("priority", "HIGH");
        autoMutation.put("details", "Interdepartmental trigger from Deed Registration approval. Pending RoR update.");
        autoMutation.put("createdAt", Instant.now().toString());

        serviceRequests.add(autoMutation);

        addAudit(actorName, "SYSTEM_INTEROP", "REGISTRATION_TO_REVENUE", "AUTO_MUTATION_TRIGGER", ulpin, "REGISTRATION_APPROVED", "REVENUE_MUTATION_CREATED");
    }

    private void validateStateTransition(String fromState, String toState) {
        if ("COMPLETED".equals(fromState) || "REJECTED".equals(fromState)) {
            throw new IllegalStateException("Cannot transition completed or rejected workflow: " + fromState);
        }
    }

    public List<Map<String, Object>> getAuditLogs() {
        return auditLogs;
    }

    public void addAudit(String userId, String role, String dept, String action, String ulpin, String prev, String nextVal) {
        Map<String, Object> log = new HashMap<>();
        log.put("id", "AUD_" + UUID.randomUUID().toString().substring(0, 8));
        log.put("timestamp", Instant.now().toString());
        log.put("userId", userId);
        log.put("role", role);
        log.put("department", dept);
        log.put("action", action);
        log.put("ulpin", ulpin);
        log.put("previousValue", prev);
        log.put("newValue", nextVal);
        auditLogs.add(0, log);
    }

    public Map<String, Object> getSchemaMapping() {
        Map<String, Object> mapping = new HashMap<>();
        
        mapping.put("maharashtra", Map.of(
            "sourceFormat", "7/12 & 8A Extract",
            "mappings", Arrays.asList(
                Map.of("sourceField", "khatedarName", "canonicalField", "ownerName", "description", "Land Holder Name"),
                Map.of("sourceField", "surveyNo", "canonicalField", "surveyNumber", "description", "Survey Plot Number"),
                Map.of("sourceField", "areaHectare", "canonicalField", "areaSquareMeters", "description", "Calculated Metric Area"),
                Map.of("sourceField", "jameenPrakar", "canonicalField", "landType", "description", "Classification Category")
            )
        ));

        mapping.put("tamilNadu", Map.of(
            "sourceFormat", "Patta & Chitta Extract",
            "mappings", Arrays.asList(
                Map.of("sourceField", "pattaHolder", "canonicalField", "ownerName", "description", "Patta Owner Name"),
                Map.of("sourceField", "surveyNumber", "canonicalField", "surveyNumber", "description", "Survey Plot Sub-division"),
                Map.of("sourceField", "extentAcres", "canonicalField", "areaSquareMeters", "description", "Converted Acre/Cent Metric Area"),
                Map.of("sourceField", "classification", "canonicalField", "landType", "description", "Nanjai / Punjai Category")
            )
        ));

        mapping.put("punjab", Map.of(
            "sourceFormat", "Jamabandi Fard Extract",
            "mappings", Arrays.asList(
                Map.of("sourceField", "khasraNumber", "canonicalField", "surveyNumber", "description", "Khasra Number"),
                Map.of("sourceField", "ownerName", "canonicalField", "ownerName", "description", "Khewat / Khatauni Owner"),
                Map.of("sourceField", "areaKanalMarla", "canonicalField", "areaSquareMeters", "description", "Kanal-Marla Standardized Area"),
                Map.of("sourceField", "landCategory", "canonicalField", "landType", "description", "Chahi / Barani Classification")
            )
        ));

        return mapping;
    }
}
