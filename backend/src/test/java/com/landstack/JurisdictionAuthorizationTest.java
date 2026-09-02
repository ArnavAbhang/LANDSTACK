package com.landstack;

import com.landstack.entity.User;
import com.landstack.service.JurisdictionAuthorizationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JurisdictionAuthorizationTest {

    @Test
    public void testJurisdictionScopingRules() {
        JurisdictionAuthorizationService jbac = new JurisdictionAuthorizationService();

        User officerHaveli = new User("OFF-01", "officer.haveli", "Suresh Patil", "REVENUE_OFFICER", "REVENUE", "MH", "Pune", "Haveli", "Paud");

        // Officer in Haveli, Pune, MH accessing Haveli parcel -> ALLOW
        assertTrue(jbac.isAuthorizedForParcel(officerHaveli, "MH", "Pune", "Haveli"));

        // Officer in Haveli, Pune, MH attempting Tamil Nadu parcel access -> DENY
        assertFalse(jbac.isAuthorizedForParcel(officerHaveli, "TN", "Kanchipuram", "Chengalpattu"));

        // Admin has global cross-jurisdictional access -> ALLOW
        User admin = new User("ADM-01", "admin.user", "System Admin", "ADMIN", "GOV_ADMIN", "ALL", "ALL", "ALL", "ALL");
        assertTrue(jbac.isAuthorizedForParcel(admin, "TN", "Kanchipuram", "Chengalpattu"));
    }
}
