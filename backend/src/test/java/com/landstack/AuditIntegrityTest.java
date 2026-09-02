package com.landstack;

import com.landstack.entity.AuditLog;
import com.landstack.service.AuditService;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AuditIntegrityTest {

    @Test
    public void testSha256AuditHashChainIntegrity() {
        AuditService auditService = new AuditService();

        // Add 3 valid audit log entries
        auditService.logAction("OFFICER_01", "REVENUE_OFFICER", "REVENUE", "APPROVE_MUTATION", "MUTATION", "MUT-101", "MH-27-PUN-000001", "SUBMITTED", "APPROVED", "SUCCESS", "Mutation Approved");
        auditService.logAction("OFFICER_02", "TAX_OFFICER", "TAX", "RECORD_TAX_PAYMENT", "TAX", "TAX-202", "MH-27-PUN-000001", "DUE", "PAID", "SUCCESS", "Tax Receipt Issued");

        Map<String, Object> verifyReport = auditService.verifyIntegrity();
        assertEquals("CHAIN_VALID", verifyReport.get("integrityStatus"));
        assertTrue((int) verifyReport.get("checkedRecords") >= 3);
    }
}
