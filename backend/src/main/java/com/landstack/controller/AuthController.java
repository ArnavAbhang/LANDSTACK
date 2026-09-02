package com.landstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Map<String, Map<String, Object>> DEMO_USERS = new HashMap<>();

    static {
        // Default Approved Resident Account
        Map<String, Object> resident = new HashMap<>();
        resident.put("id", "usr_res_01");
        resident.put("email", "resident@example.com");
        resident.put("name", "Rajendra Patil");
        resident.put("phone", "+91 98230 11245");
        resident.put("role", "RESIDENT");
        resident.put("portal", "RESIDENT");
        resident.put("state", "Maharashtra");
        resident.put("stateId", "ST_MH");
        resident.put("district", "Pune");
        resident.put("districtId", "DIST_PUNE");
        resident.put("taluka", "Haveli");
        resident.put("talukaId", "TAL_HAVELI");
        resident.put("village", "Paud");
        resident.put("villageId", "LOC_PAUD");
        resident.put("aadhaarNumber", "9876-5432-1098");
        resident.put("aadhaarDocument", "aadhaar_rajendra_patil_scanned.pdf");
        resident.put("verificationStatus", "APPROVED");
        resident.put("permissions", Arrays.asList("VIEW_MY_PARCELS", "SUBMIT_SERVICE_REQUEST", "VIEW_PUBLIC_GIS"));
        DEMO_USERS.put("resident@example.com", resident);

        // Revenue Officer Account
        Map<String, Object> revOfficer = new HashMap<>();
        revOfficer.put("id", "usr_rev_01");
        revOfficer.put("email", "revenue.officer@example.gov");
        revOfficer.put("name", "Tahashildar Haveli");
        revOfficer.put("role", "REVENUE_OFFICER");
        revOfficer.put("portal", "GOVERNMENT");
        revOfficer.put("department", "REVENUE");
        revOfficer.put("state", "Maharashtra");
        revOfficer.put("district", "Pune");
        revOfficer.put("taluka", "Haveli");
        revOfficer.put("village", "Paud");
        revOfficer.put("permissions", Arrays.asList("VIEW_ALL_PARCELS", "APPROVE_MUTATIONS", "VERIFY_ROR", "VIEW_AI_ALERTS", "INVESTIGATE_ALERTS"));
        DEMO_USERS.put("revenue.officer@example.gov", revOfficer);

        // System Administrator Account
        Map<String, Object> adminOfficer = new HashMap<>();
        adminOfficer.put("id", "usr_admin_01");
        adminOfficer.put("email", "admin.landstack@example.gov");
        adminOfficer.put("name", "System Administrator Hub");
        adminOfficer.put("role", "ADMIN");
        adminOfficer.put("portal", "GOVERNMENT");
        adminOfficer.put("department", "ADMIN");
        adminOfficer.put("state", "Maharashtra");
        adminOfficer.put("district", "Pune");
        adminOfficer.put("permissions", Arrays.asList("APPROVE_RESIDENT_AADHAAR", "SYSTEM_HEALTH", "AUDIT_LOGS", "USER_MANAGEMENT"));
        DEMO_USERS.put("admin.landstack@example.gov", adminOfficer);

        // Sample Pending Resident Account for Demo
        Map<String, Object> pendingResident = new HashMap<>();
        pendingResident.put("id", "usr_res_pending_02");
        pendingResident.put("email", "anita.deshmukh@example.com");
        pendingResident.put("name", "Anita Deshmukh");
        pendingResident.put("phone", "+91 97654 32109");
        pendingResident.put("role", "RESIDENT");
        pendingResident.put("portal", "RESIDENT");
        pendingResident.put("state", "Maharashtra");
        pendingResident.put("stateId", "ST_MH");
        pendingResident.put("district", "Pune");
        pendingResident.put("districtId", "DIST_PUNE");
        pendingResident.put("taluka", "Mulshi");
        pendingResident.put("talukaId", "TAL_MUL");
        pendingResident.put("village", "Hinjawadi");
        pendingResident.put("villageId", "LOC_HINJ");
        pendingResident.put("aadhaarNumber", "4567-8901-2345");
        pendingResident.put("aadhaarDocument", "aadhaar_anita_deshmukh.pdf");
        pendingResident.put("verificationStatus", "PENDING_ADMIN_APPROVAL");
        pendingResident.put("permissions", Arrays.asList("VIEW_PUBLIC_GIS"));
        DEMO_USERS.put("anita.deshmukh@example.com", pendingResident);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        String name = payload.getOrDefault("name", "Registered User");
        String phone = payload.getOrDefault("phone", "+91 98000 00000");
        String portal = payload.getOrDefault("portal", "RESIDENT");
        String state = payload.getOrDefault("state", "Maharashtra");
        String stateId = payload.getOrDefault("stateId", "ST_MH");
        String district = payload.getOrDefault("district", "Pune");
        String districtId = payload.getOrDefault("districtId", "DIST_PUNE");
        String taluka = payload.getOrDefault("taluka", "Haveli");
        String talukaId = payload.getOrDefault("talukaId", "TAL_HAVELI");
        String village = payload.getOrDefault("village", "Paud");
        String villageId = payload.getOrDefault("villageId", "LOC_PAUD");
        String aadhaarNumber = payload.getOrDefault("aadhaarNumber", "1234-5678-9012");
        String aadhaarDocument = payload.getOrDefault("aadhaarDocument", "aadhaar_card_scanned.pdf");
        String role = payload.getOrDefault("role", portal.equals("GOVERNMENT") ? "REVENUE_OFFICER" : "RESIDENT");
        String department = payload.getOrDefault("department", portal.equals("GOVERNMENT") ? "REVENUE" : "RESIDENT");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email address is required"));
        }

        boolean isResident = "RESIDENT".equalsIgnoreCase(portal);
        String verificationStatus = isResident ? "PENDING_ADMIN_APPROVAL" : "APPROVED";

        Map<String, Object> user = new HashMap<>();
        user.put("id", "usr_" + UUID.randomUUID().toString().substring(0, 8));
        user.put("email", email.toLowerCase().trim());
        user.put("name", name);
        user.put("phone", phone);
        user.put("role", role);
        user.put("portal", portal);
        user.put("department", department);
        user.put("state", state);
        user.put("stateId", stateId);
        user.put("district", district);
        user.put("districtId", districtId);
        user.put("taluka", taluka);
        user.put("talukaId", talukaId);
        user.put("village", village);
        user.put("villageId", villageId);
        user.put("aadhaarNumber", aadhaarNumber);
        user.put("aadhaarDocument", aadhaarDocument);
        user.put("verificationStatus", verificationStatus);
        user.put("permissions", isResident 
            ? Arrays.asList("VIEW_MY_PARCELS", "SUBMIT_SERVICE_REQUEST", "VIEW_PUBLIC_GIS")
            : Arrays.asList("VIEW_ALL_PARCELS", "APPROVE_MUTATIONS", "VERIFY_ROR", "VIEW_AI_ALERTS"));

        DEMO_USERS.put(email.toLowerCase().trim(), user);

        String token = "jwt_token_" + Base64.getEncoder().encodeToString((email + ":" + Instant.now().toEpochMilli()).getBytes());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("message", isResident 
            ? "Account created! Aadhaar verification request sent to System Administrator for approval." 
            : "Government officer account created successfully.");
        response.put("expiresAt", Instant.now().plusSeconds(86400).toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String portal = credentials.getOrDefault("portal", "RESIDENT");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        Map<String, Object> user = DEMO_USERS.get(email.toLowerCase().trim());
        if (user == null) {
            user = new HashMap<>();
            user.put("id", "usr_demo_" + UUID.randomUUID().toString().substring(0, 6));
            user.put("email", email);
            user.put("name", email.contains("gov") ? "Government Official" : "Authenticated Citizen");
            user.put("phone", "+91 98220 54321");
            user.put("role", email.contains("gov") ? "REVENUE_OFFICER" : "RESIDENT");
            user.put("portal", portal);
            user.put("department", email.contains("gov") ? "REVENUE" : "RESIDENT");
            user.put("state", "Maharashtra");
            user.put("stateId", "ST_MH");
            user.put("district", "Pune");
            user.put("districtId", "DIST_PUNE");
            user.put("taluka", "Haveli");
            user.put("talukaId", "TAL_HAVELI");
            user.put("village", "Paud");
            user.put("villageId", "LOC_PAUD");
            user.put("aadhaarNumber", "9876-5432-1098");
            user.put("verificationStatus", "APPROVED");
            user.put("permissions", Arrays.asList("VIEW_PARCELS"));
        }

        String token = "jwt_token_" + Base64.getEncoder().encodeToString((email + ":" + Instant.now().toEpochMilli()).getBytes());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("expiresAt", Instant.now().plusSeconds(86400).toString());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verifications")
    public ResponseEntity<List<Map<String, Object>>> getVerifications() {
        List<Map<String, Object>> residentVerifications = new ArrayList<>();
        for (Map<String, Object> u : DEMO_USERS.values()) {
            if ("RESIDENT".equals(u.get("portal"))) {
                residentVerifications.add(u);
            }
        }
        return ResponseEntity.ok(residentVerifications);
    }

    @PostMapping("/verifications/{userId}/approve")
    public ResponseEntity<?> approveVerification(@PathVariable String userId) {
        for (Map<String, Object> u : DEMO_USERS.values()) {
            if (userId.equalsIgnoreCase((String) u.get("id"))) {
                u.put("verificationStatus", "APPROVED");
                return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Resident Aadhaar verification APPROVED by System Administrator", "user", u));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/verifications/{userId}/reject")
    public ResponseEntity<?> rejectVerification(@PathVariable String userId) {
        for (Map<String, Object> u : DEMO_USERS.values()) {
            if (userId.equalsIgnoreCase((String) u.get("id"))) {
                u.put("verificationStatus", "REJECTED");
                return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Resident Aadhaar verification REJECTED by System Administrator", "user", u));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null) return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));

        Map<String, Object> user = DEMO_USERS.get(email.toLowerCase().trim());
        if (user == null) return ResponseEntity.notFound().build();

        if (payload.containsKey("name")) user.put("name", payload.get("name"));
        if (payload.containsKey("phone")) user.put("phone", payload.get("phone"));
        if (payload.containsKey("state")) user.put("state", payload.get("state"));
        if (payload.containsKey("stateId")) user.put("stateId", payload.get("stateId"));
        if (payload.containsKey("district")) user.put("district", payload.get("district"));
        if (payload.containsKey("districtId")) user.put("districtId", payload.get("districtId"));
        if (payload.containsKey("taluka")) user.put("taluka", payload.get("taluka"));
        if (payload.containsKey("talukaId")) user.put("talukaId", payload.get("talukaId"));
        if (payload.containsKey("village")) user.put("village", payload.get("village"));
        if (payload.containsKey("villageId")) user.put("villageId", payload.get("villageId"));

        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "User profile updated successfully", "user", user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> user = DEMO_USERS.get("resident@example.com");
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Logged out successfully"));
    }
}

