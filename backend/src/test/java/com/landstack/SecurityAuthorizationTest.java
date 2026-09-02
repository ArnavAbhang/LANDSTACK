package com.landstack;

import com.landstack.service.JurisdictionAuthorizationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityAuthorizationTest {

    @Test
    public void testRolePermissionsMapping() {
        JurisdictionAuthorizationService authService = new JurisdictionAuthorizationService();

        assertTrue(authService.hasPermission("LAND_OWNER", "VIEW_OWN_PROPERTIES"));
        assertTrue(authService.hasPermission("REVENUE_OFFICER", "REVIEW_MUTATION"));
        assertTrue(authService.hasPermission("REGISTRATION_OFFICER", "VERIFY_DEED"));
        assertTrue(authService.hasPermission("TAX_OFFICER", "UPDATE_TAX_STATUS"));
        assertTrue(authService.hasPermission("PLANNING_OFFICER", "REVIEW_PLANNING_CONFLICT"));
        assertTrue(authService.hasPermission("ADMIN", "SYSTEM_CONFIGURATION"));

        assertFalse(authService.hasPermission("LAND_OWNER", "APPROVE_MUTATION"));
        assertFalse(authService.hasPermission("TAX_OFFICER", "APPROVE_MUTATION"));
    }
}
