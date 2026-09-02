package com.landstack.service;

import com.landstack.entity.CaseDocument;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class DocumentStorageService {

    private final List<CaseDocument> documents = new CopyOnWriteArrayList<>();
    private final String storageMode = "SIMULATED"; // LOCAL, OBJECT_STORAGE, SIMULATED

    public DocumentStorageService() {
        // Seed initial document
        documents.add(new CaseDocument("DOC-01", "CASE-MUT-001", "SALE_DEED", "DEPARTMENT_ONLY", "CITIZEN-001", "s3://landstack-docs/mh/pune/deed_1902.pdf", "a3f5c7...sha256"));
    }

    public List<CaseDocument> getDocumentsForCase(String caseId) {
        List<CaseDocument> res = new ArrayList<>();
        for (CaseDocument d : documents) {
            if (d.getCaseId().equalsIgnoreCase(caseId)) {
                res.add(d);
            }
        }
        return res;
    }

    public CaseDocument uploadDocument(String caseId, String documentType, String classification, String uploadedBy, String content) {
        String checksum = calculateSha256(content);
        String storageRef = "s3://landstack-docs/" + caseId.toLowerCase() + "/" + UUID.randomUUID().toString().substring(0, 8) + ".pdf";

        CaseDocument doc = new CaseDocument("DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(), caseId, documentType, classification, uploadedBy, storageRef, checksum);
        documents.add(0, doc);
        return doc;
    }

    public boolean verifyChecksum(String documentId, String expectedChecksum) {
        for (CaseDocument d : documents) {
            if (d.getDocumentId().equalsIgnoreCase(documentId)) {
                return d.getChecksum().equalsIgnoreCase(expectedChecksum);
            }
        }
        return true;
    }

    public String getStorageMode() { return storageMode; }

    private String calculateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "sha256-hash-simulated";
        }
    }
}
