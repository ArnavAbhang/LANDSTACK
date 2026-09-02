package com.landstack.entity;

import java.time.Instant;

public class Person {
    private Long id;
    private String personId; // e.g. LS-PER-00000125
    private String name;
    private String normalizedName;
    private String email;
    private String phone;
    private String address;
    private String stateCode;
    private String districtId;
    private String talukaId;
    private String villageId;
    private String identityStatus = "VERIFIED_PROTOTYPE";
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();

    public Person() {}

    public Person(String personId, String name, String email, String phone, String address, String stateCode, String districtId, String talukaId, String villageId) {
        this.personId = personId;
        this.name = name;
        this.normalizedName = name.replaceAll("\\s+", " ").trim().toUpperCase();
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.stateCode = stateCode;
        this.districtId = districtId;
        this.talukaId = talukaId;
        this.villageId = villageId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPersonId() { return personId; }
    public void setPersonId(String personId) { this.personId = personId; }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        if (name != null) this.normalizedName = name.replaceAll("\\s+", " ").trim().toUpperCase();
    }

    public String getNormalizedName() { return normalizedName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getTalukaId() { return talukaId; }
    public void setTalukaId(String talukaId) { this.talukaId = talukaId; }

    public String getVillageId() { return villageId; }
    public void setVillageId(String villageId) { this.villageId = villageId; }

    public String getIdentityStatus() { return identityStatus; }
    public void setIdentityStatus(String identityStatus) { this.identityStatus = identityStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
