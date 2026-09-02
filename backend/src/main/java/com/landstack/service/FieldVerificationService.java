package com.landstack.service;

import com.landstack.entity.FieldVerification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class FieldVerificationService {

    private final List<FieldVerification> fieldVerifications = new CopyOnWriteArrayList<>();

    public FieldVerificationService() {
        // Seed initial field verification
        fieldVerifications.add(new FieldVerification("FV-01", "CASE-MUT-001", "MH-27-PUN-000001", "OFFICER_REVENUE_PAUD", "Boundary physical check scheduled for Paud village parcel 125/1."));
    }

    public List<FieldVerification> getAllVerifications() {
        return Collections.unmodifiableList(fieldVerifications);
    }

    public FieldVerification getVerificationById(String id) {
        for (FieldVerification fv : fieldVerifications) {
            if (fv.getVerificationId().equalsIgnoreCase(id) || fv.getCaseId().equalsIgnoreCase(id)) {
                return fv;
            }
        }
        return null;
    }

    public FieldVerification createVerification(String caseId, String ulpin, String officer, String obs) {
        FieldVerification fv = new FieldVerification("FV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), caseId, ulpin, officer, obs);
        fieldVerifications.add(0, fv);
        return fv;
    }

    public FieldVerification completeVerification(String verificationId, String observations, String outcome, Double lat, Double lng) {
        FieldVerification fv = getVerificationById(verificationId);
        if (fv != null) {
            fv.setObservations(observations);
            fv.setVerificationStatus("VERIFIED".equalsIgnoreCase(outcome) ? "VERIFIED" : "FAILED");
            if (lat != null) fv.setLatitude(lat);
            if (lng != null) fv.setLongitude(lng);
        }
        return fv;
    }
}
