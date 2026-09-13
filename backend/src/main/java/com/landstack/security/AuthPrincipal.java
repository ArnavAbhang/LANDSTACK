package com.landstack.security;

public class AuthPrincipal {

    private final String personId;
    private final String name;
    private final String role; // PUBLIC, RESIDENT, REVENUE_OFFICER, REGISTRATION_OFFICER, TAX_OFFICER, PLANNING_OFFICER, ADMIN
    private final String department;
    private final String stateId;
    private final String districtId;
    private final String talukaId;
    private final String villageId;

    public AuthPrincipal(String personId, String name, String role, String department, String stateId, String districtId, String talukaId, String villageId) {
        this.personId = personId;
        this.name = name;
        this.role = role != null ? role.toUpperCase() : "PUBLIC";
        this.department = department != null ? department.toUpperCase() : "PUBLIC";
        this.stateId = stateId;
        this.districtId = districtId;
        this.talukaId = talukaId;
        this.villageId = villageId;
    }

    public String getPersonId() {
        return personId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getDepartment() {
        return department;
    }

    public String getStateId() {
        return stateId;
    }

    public String getDistrictId() {
        return districtId;
    }

    public String getTalukaId() {
        return talukaId;
    }

    public String getVillageId() {
        return villageId;
    }

    public boolean isResident() {
        return "RESIDENT".equalsIgnoreCase(role) || "LAND_OWNER".equalsIgnoreCase(role);
    }

    public boolean isGovernment() {
        return "REVENUE_OFFICER".equalsIgnoreCase(role) ||
               "REGISTRATION_OFFICER".equalsIgnoreCase(role) ||
               "TAX_OFFICER".equalsIgnoreCase(role) ||
               "PLANNING_OFFICER".equalsIgnoreCase(role) ||
               "GOVERNMENT".equalsIgnoreCase(role) ||
               "ADMIN".equalsIgnoreCase(role);
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }

    public boolean isPublic() {
        return "PUBLIC".equalsIgnoreCase(role) || role == null;
    }
}
