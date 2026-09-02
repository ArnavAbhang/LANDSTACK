package com.landstack.entity;

import java.time.Instant;

public class CaseDocument {
    private String documentId;
    private String caseId;
    private String documentType;
    private String classification = "DEPARTMENT_ONLY"; // PUBLIC, OWNER_ONLY, DEPARTMENT_ONLY, RESTRICTED
    private String uploadedBy;
    private String storageReference;
    private String checksum;
    private String uploadedAt = Instant.now().toString();

    public CaseDocument() {}

    public CaseDocument(String documentId, String caseId, String documentType, String classification, String uploadedBy, String storageReference, String checksum) {
        this.documentId = documentId;
        this.caseId = caseId;
        this.documentType = documentType;
        this.classification = classification;
        this.uploadedBy = uploadedBy;
        this.storageReference = storageReference;
        this.checksum = checksum;
    }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getStorageReference() { return storageReference; }
    public void setStorageReference(String storageReference) { this.storageReference = storageReference; }

    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }
}
