package com.landstack.service;

import com.landstack.entity.User;
import org.springframework.stereotype.Service;

@Service
public class DocumentAccessService {

    /**
     * Document Classification Rules:
     * - PUBLIC: Open to all authenticated users.
     * - OWNER_ONLY: Accessible only by parcel owner or authorized government officers.
     * - DEPARTMENT_ONLY: Accessible only by department officers.
     * - RESTRICTED: Accessible only by ADMIN or higher judicial authority.
     */
    public boolean isDocumentAccessible(User user, String classification, String documentType, String parcelUlpin) {
        if (classification == null || "PUBLIC".equalsIgnoreCase(classification)) {
            return true;
        }

        if (user == null) {
            return false;
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        if ("RESTRICTED".equalsIgnoreCase(classification)) {
            return "ADMIN".equalsIgnoreCase(user.getRole()) || "DISPUTE_OFFICER".equalsIgnoreCase(user.getRole());
        }

        if ("DEPARTMENT_ONLY".equalsIgnoreCase(classification)) {
            return !"LAND_OWNER".equalsIgnoreCase(user.getRole()) && !"PUBLIC".equalsIgnoreCase(user.getRole());
        }

        if ("OWNER_ONLY".equalsIgnoreCase(classification)) {
            return "LAND_OWNER".equalsIgnoreCase(user.getRole()) || !"PUBLIC".equalsIgnoreCase(user.getRole());
        }

        return false;
    }
}
