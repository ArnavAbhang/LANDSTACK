package com.landstack.entity;

public class User {
    private String id;
    private String username;
    private String email;
    private String mobile;
    private String fullName;
    private String role; // LAND_OWNER, REVENUE_OFFICER, REGISTRATION_OFFICER, TAX_OFFICER, PLANNING_OFFICER, UTILITY_OFFICER, DISPUTE_OFFICER, ADMIN
    private String departmentCode;
    private String stateCode;
    private String districtId;
    private String talukaId;
    private String villageId;
    private String status = "ACTIVE";

    public User() {}

    public User(String id, String username, String fullName, String role, String departmentCode, String stateCode, String districtId, String talukaId, String villageId) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.departmentCode = departmentCode;
        this.stateCode = stateCode;
        this.districtId = districtId;
        this.talukaId = talukaId;
        this.villageId = villageId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getTalukaId() { return talukaId; }
    public void setTalukaId(String talukaId) { this.talukaId = talukaId; }

    public String getVillageId() { return villageId; }
    public void setVillageId(String villageId) { this.villageId = villageId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
