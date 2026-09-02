package com.landstack.service;

import com.landstack.entity.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class JurisdictionAuthorizationService {

    private final Map<String, Set<String>> rolePermissions = new HashMap<>();

    public JurisdictionAuthorizationService() {
        // Initialize Role-Based Permissions (RBAC Matrix)
        rolePermissions.put("LAND_OWNER", Set.of(
            "VIEW_OWN_PROPERTIES", "VIEW_OWN_ROR", "VIEW_OWN_TAX", "CREATE_SERVICE_REQUEST", "VIEW_OWN_REQUESTS", "VIEW_PUBLIC_GIS"
        ));

        rolePermissions.put("REVENUE_OFFICER", Set.of(
            "VIEW_PARCELS", "VIEW_ROR", "REVIEW_MUTATION", "CREATE_FIELD_VERIFICATION", "VIEW_DISPUTES", "APPROVE_MUTATION"
        ));

        rolePermissions.put("REGISTRATION_OFFICER", Set.of(
            "VIEW_REGISTRATION", "PROCESS_REGISTRATION", "VIEW_ENCUMBRANCE", "VERIFY_DEED"
        ));

        rolePermissions.put("TAX_OFFICER", Set.of(
            "VIEW_TAX", "UPDATE_TAX_STATUS", "VIEW_TAX_ANALYTICS", "RECORD_TAX_PAYMENT"
        ));

        rolePermissions.put("PLANNING_OFFICER", Set.of(
            "VIEW_ZONING", "VIEW_MASTER_PLAN", "VIEW_LAND_USE", "REVIEW_PLANNING_CONFLICT"
        ));

        rolePermissions.put("UTILITY_OFFICER", Set.of(
            "VIEW_UTILITY_NETWORK", "VIEW_UTILITY_CONNECTION", "APPROVE_UTILITY_CONNECT"
        ));

        rolePermissions.put("DISPUTE_OFFICER", Set.of(
            "VIEW_DISPUTES", "UPDATE_DISPUTE_WORKFLOW", "REVIEW_AI_ALERT", "SCHEDULE_HEARING"
        ));

        rolePermissions.put("ADMIN", Set.of(
            "SYSTEM_CONFIGURATION", "USER_MANAGEMENT", "AUDIT_ACCESS", "ADAPTER_MANAGEMENT", "VIEW_RAW_SOURCE", "ALL_JURISDICTIONS"
        ));
    }

    /**
     * Checks if a user role possesses a specific permission string.
     */
    public boolean hasPermission(String role, String permission) {
        if ("ADMIN".equalsIgnoreCase(role)) return true;
        Set<String> perms = rolePermissions.getOrDefault(role.toUpperCase(), Collections.emptySet());
        return perms.contains(permission);
    }

    /**
     * Backend Jurisdiction-Based Access Control (JBAC).
     * Validates user's assigned stateCode, districtId, talukaId against parcel's jurisdiction.
     */
    public boolean isAuthorizedForParcel(User user, String parcelState, String parcelDistrict, String parcelTaluka) {
        if (user == null) return false;
        
        // System Administrator has cross-jurisdictional access
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        // Land owner can access properties under their state/owner scope
        if ("LAND_OWNER".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        // Check State Jurisdiction
        if (user.getStateCode() != null && !user.getStateCode().isEmpty() && !"ALL".equalsIgnoreCase(user.getStateCode())) {
            if (!user.getStateCode().equalsIgnoreCase(parcelState)) {
                return false;
            }
        }

        // Check District Jurisdiction
        if (user.getDistrictId() != null && !user.getDistrictId().isEmpty() && !"ALL".equalsIgnoreCase(user.getDistrictId())) {
            if (parcelDistrict != null && !parcelDistrict.toLowerCase().contains(user.getDistrictId().toLowerCase())) {
                return false;
            }
        }

        // Check Taluka Jurisdiction
        if (user.getTalukaId() != null && !user.getTalukaId().isEmpty() && !"ALL".equalsIgnoreCase(user.getTalukaId())) {
            if (parcelTaluka != null && !parcelTaluka.toLowerCase().contains(user.getTalukaId().toLowerCase())) {
                return false;
            }
        }

        return true;
    }

    public Map<String, Set<String>> getRolePermissionsMatrix() {
        return Collections.unmodifiableMap(rolePermissions);
    }
}
