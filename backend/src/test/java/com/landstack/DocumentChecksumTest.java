package com.landstack;

import com.landstack.entity.CaseDocument;
import com.landstack.service.DocumentStorageService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DocumentChecksumTest {

    @Test
    public void testDocumentUploadAndChecksumVerification() {
        DocumentStorageService storageService = new DocumentStorageService();

        CaseDocument doc = storageService.uploadDocument("CASE-MUT-001", "SALE_DEED", "DEPARTMENT_ONLY", "CITIZEN-001", "Deed Content PDF Buffer");
        assertNotNull(doc.getDocumentId());
        assertNotNull(doc.getChecksum());
        assertTrue(storageService.verifyChecksum(doc.getDocumentId(), doc.getChecksum()));
    }
}
