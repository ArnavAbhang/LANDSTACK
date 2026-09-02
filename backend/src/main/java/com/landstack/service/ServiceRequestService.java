package com.landstack.service;

import com.landstack.entity.ServiceRequest;
import com.landstack.entity.WorkflowCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ServiceRequestService {

    private final List<ServiceRequest> serviceRequests = new CopyOnWriteArrayList<>();
    private final WorkflowCaseService caseService;
    private final SlaService slaService;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Autowired
    public ServiceRequestService(WorkflowCaseService caseService, SlaService slaService, NotificationService notificationService, AuditService auditService) {
        this.caseService = caseService;
        this.slaService = slaService;
        this.notificationService = notificationService;
        this.auditService = auditService;

        // Seed initial Service Requests
        serviceRequests.add(new ServiceRequest("REQ-MUT-001", "MH-MUT-2026-0001", "MUTATION_REQUEST", "CITIZEN-001", "MH-27-PUN-000001", "MH", "PUNE", "HAVELI", "PAUD_001", "Revenue Dept", "Request for 7/12 RoR Mutation ownership update following registered sale deed."));
        serviceRequests.add(new ServiceRequest("REQ-CORR-002", "TN_PATTA_2026_0002", "LAND_RECORD_CORRECTION", "CITIZEN-002", "TN-03-KCH-000002", "TN", "KANCHIPURAM", "KANCHI", "ORAGADAM_001", "Revenue Dept", "Correction request for survey number spelling in Tamil Nilam Patta record."));
    }

    public List<ServiceRequest> getAllRequests() {
        return Collections.unmodifiableList(serviceRequests);
    }

    public List<ServiceRequest> getRequestsForUser(String requesterId) {
        if (requesterId == null || requesterId.isEmpty()) return getAllRequests();
        List<ServiceRequest> res = new ArrayList<>();
        for (ServiceRequest req : serviceRequests) {
            if (requesterId.equalsIgnoreCase(req.getRequesterId())) {
                res.add(req);
            }
        }
        return res;
    }

    public ServiceRequest getRequestById(String id) {
        for (ServiceRequest req : serviceRequests) {
            if (req.getId().equalsIgnoreCase(id) || req.getRequestNumber().equalsIgnoreCase(id)) {
                return req;
            }
        }
        return null;
    }

    public ServiceRequest createRequest(String requestType, String requesterId, String ulpin, String stateCode, String districtId, String talukaId, String villageId, String department, String description) {
        String reqNum = stateCode + "-" + requestType.substring(0, 3) + "-" + System.currentTimeMillis();
        ServiceRequest req = new ServiceRequest("REQ-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), reqNum, requestType, requesterId, ulpin, stateCode, districtId, talukaId, villageId, department, description);
        serviceRequests.add(0, req);

        // Create Workflow Case & SLA
        WorkflowCase c = new WorkflowCase("CASE-" + req.getId(), req.getId(), "SUBMITTED", department);
        caseService.getAllCases(); // ensure initialized
        slaService.createSlaForCase(c.getCaseId(), requestType);

        // Audit & Notification
        auditService.logAction(requesterId, "LAND_OWNER", department, "SERVICE_REQUEST_CREATED", "SERVICE_REQUEST", req.getId(), villageId, "N/A", "Created " + requestType + " for ULPIN " + ulpin, "SUCCESS", "Service Request Portal");
        notificationService.sendNotification(requesterId, c.getCaseId(), "IN_APP", "REQUEST_SUBMITTED", "Service Request Submitted", "Your request " + reqNum + " for parcel " + ulpin + " has been submitted successfully.");

        return req;
    }
}
