package com.landstack.service;

import com.landstack.entity.CaseAssignment;
import com.landstack.entity.WorkflowCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class WorkflowCaseService {

    private final List<WorkflowCase> cases = new CopyOnWriteArrayList<>();
    private final List<CaseAssignment> assignments = new CopyOnWriteArrayList<>();
    private final AuditService auditService;
    private final SlaService slaService;

    // Allowed transition map for State Machine
    private final Map<String, Set<String>> allowedTransitions = new HashMap<>();

    @Autowired
    public WorkflowCaseService(AuditService auditService, SlaService slaService) {
        this.auditService = auditService;
        this.slaService = slaService;

        // Configure Controlled Workflow State Machine
        allowedTransitions.put("SUBMITTED", Set.of("UNDER_VALIDATION", "REJECTED"));
        allowedTransitions.put("UNDER_VALIDATION", Set.of("ASSIGNED", "AWAITING_DOCUMENTS", "REJECTED"));
        allowedTransitions.put("ASSIGNED", Set.of("UNDER_REVIEW", "REASSIGNED", "ESCALATED"));
        allowedTransitions.put("UNDER_REVIEW", Set.of("FIELD_VERIFICATION_REQUIRED", "AWAITING_DOCUMENTS", "APPROVED", "REJECTED", "ESCALATED"));
        allowedTransitions.put("FIELD_VERIFICATION_REQUIRED", Set.of("FIELD_VERIFICATION", "UNDER_REVIEW", "REJECTED"));
        allowedTransitions.put("FIELD_VERIFICATION", Set.of("UNDER_REVIEW", "APPROVED", "REJECTED"));
        allowedTransitions.put("AWAITING_DOCUMENTS", Set.of("UNDER_REVIEW", "REJECTED"));
        allowedTransitions.put("APPROVED", Set.of("COMPLETED", "CLOSED"));
        allowedTransitions.put("REJECTED", Set.of("CLOSED"));
        allowedTransitions.put("COMPLETED", Set.of("CLOSED"));
        allowedTransitions.put("CLOSED", Collections.emptySet()); // Terminal state

        // Seed initial case
        WorkflowCase case1 = new WorkflowCase("CASE-MUT-001", "REQ-MUT-001", "ASSIGNED", "Revenue Dept");
        case1.setCurrentOfficer("OFFICER_REVENUE_PAUD");
        cases.add(case1);

        assignments.add(new CaseAssignment("ASG-01", "CASE-MUT-001", "OFFICER_REVENUE_PAUD", "Revenue Dept", "Assigned for Paud village land mutation review"));
    }

    public List<WorkflowCase> getAllCases() { return Collections.unmodifiableList(cases); }
    public List<CaseAssignment> getAllAssignments() { return Collections.unmodifiableList(assignments); }

    public WorkflowCase getCaseById(String caseId) {
        for (WorkflowCase c : cases) {
            if (c.getCaseId().equalsIgnoreCase(caseId) || c.getRequestId().equalsIgnoreCase(caseId)) {
                return c;
            }
        }
        return null;
    }

    public boolean isValidTransition(String currentStage, String nextStage) {
        if (currentStage == null || nextStage == null) return false;
        Set<String> validNext = allowedTransitions.getOrDefault(currentStage.toUpperCase(), Collections.emptySet());
        return validNext.contains(nextStage.toUpperCase());
    }

    public WorkflowCase transitionStage(String caseId, String nextStage, String actor, String role, String department, String reason) {
        WorkflowCase c = getCaseById(caseId);
        if (c == null) throw new IllegalArgumentException("Workflow case not found: " + caseId);

        String currentStage = c.getCurrentStage();
        if (!isValidTransition(currentStage, nextStage)) {
            throw new IllegalStateException("Invalid workflow transition from " + currentStage + " to " + nextStage);
        }

        c.setCurrentStage(nextStage);
        c.setUpdatedAt(Instant.now().toString());
        if ("CLOSED".equalsIgnoreCase(nextStage)) {
            c.setClosedAt(Instant.now().toString());
        }

        auditService.logAction(actor, role, department, "CASE_STAGE_TRANSITION", "WORKFLOW_CASE", c.getCaseId(), "PAUD_001", "N/A", "Transitioned from " + currentStage + " to " + nextStage + ": " + reason, "SUCCESS", "Workflow Engine State Machine");

        return c;
    }

    public WorkflowCase assignOfficer(String caseId, String officerId, String department, String actor, String role, String remarks) {
        WorkflowCase c = getCaseById(caseId);
        if (c == null) throw new IllegalArgumentException("Workflow case not found: " + caseId);

        c.setCurrentOfficer(officerId);
        c.setCurrentStage("ASSIGNED");
        c.setUpdatedAt(Instant.now().toString());

        CaseAssignment asg = new CaseAssignment("ASG-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), caseId, officerId, department, remarks);
        assignments.add(0, asg);

        auditService.logAction(actor, role, department, "CASE_ASSIGNED", "WORKFLOW_CASE", c.getCaseId(), "PAUD_001", "N/A", "Assigned officer " + officerId + ": " + remarks, "SUCCESS", "Officer Assignment Service");

        return c;
    }

    public WorkflowCase escalateCase(String caseId, String actor, String role, String department, String reason) {
        WorkflowCase c = getCaseById(caseId);
        if (c == null) throw new IllegalArgumentException("Workflow case not found: " + caseId);

        c.setEscalationLevel(c.getEscalationLevel() + 1);
        c.setCurrentStage("ESCALATED");
        c.setPriority("URGENT");
        c.setUpdatedAt(Instant.now().toString());

        slaService.escalateCase(caseId);

        auditService.logAction(actor, role, department, "CASE_ESCALATED", "WORKFLOW_CASE", c.getCaseId(), "PAUD_001", "N/A", "Escalated case level " + c.getEscalationLevel() + ": " + reason, "SUCCESS", "SLA Escalation Service");

        return c;
    }
}
