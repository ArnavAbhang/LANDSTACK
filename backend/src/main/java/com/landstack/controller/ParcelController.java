package com.landstack.controller;

import com.landstack.dto.GovernmentParcelDTO;
import com.landstack.dto.PublicParcelDTO;
import com.landstack.dto.ResidentParcelDTO;
import com.landstack.entity.Ownership;
import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import com.landstack.service.AiGovernanceService;
import com.landstack.service.PersonService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/parcels")
@CrossOrigin(origins = "*")
public class ParcelController {

    private final PersonService personService;
    private final AiGovernanceService aiGovernanceService;

    @Autowired
    public ParcelController(PersonService personService, AiGovernanceService aiGovernanceService) {
        this.personService = personService;
        this.aiGovernanceService = aiGovernanceService;
    }

    private static Map<String, Object> createParcel(
            String ulpin, String surveyNo, String ownerName, double areaHectare,
            String landType, String taxStatus, String disputeRisk, String disputeSummary,
            String state, String district, String taluka, String village) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("ulpin", ulpin);
        map.put("surveyNo", surveyNo);
        map.put("ownerName", ownerName);
        map.put("areaHectare", areaHectare);
        map.put("landType", landType);
        map.put("taxStatus", taxStatus);
        map.put("disputeRisk", disputeRisk);
        map.put("disputeSummary", disputeSummary);
        map.put("state", state);
        map.put("district", district);
        map.put("taluka", taluka);
        map.put("village", village);
        return map;
    }

    private static final List<Map<String, Object>> PARCELS_DATA = Arrays.asList(
        createParcel("MH-27-PUN-000001", "123/4", "Rajendra Patil", 2.45, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000002", "124/2", "Sneha Kulkarni", 1.82, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000003", "125/1", "Vijay Jadhav", 3.1, "Agricultural", "OVERDUE", "HIGH", "Civil Suit CS/2024/9903 - Boundary Dispute", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000004", "126/3", "Meena Shinde", 1.36, "Residential", "PAID", "MEDIUM", "Satellite footprint alert", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000005", "127/2", "Sanjay Deshmukh", 4.2, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000006", "128/1", "Pooja Pawar", 2.18, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000007", "129/4", "Amit Bhosale", 1.74, "Commercial", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000008", "130/2", "Neha Gaikwad", 3.65, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000009", "131/1", "Rohit More", 2.05, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000010", "132/3", "Kavita Chavan", 2.92, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000011", "143/4", "Dnyaneshwar Patil", 2.9, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000012", "144/1", "Sunita Kulkarni", 3.6, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000013", "145/2", "Anil Bhosale", 1.3, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000014", "146/3", "Priya Deshmukh", 2.0, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000015", "147/4", "Vikas Gaikwad", 2.7, "Commercial", "OVERDUE", "HIGH", "Civil Suit CS/2024/9915 - Boundary Dispute", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000016", "148/1", "Aarti Shinde", 3.4, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000017", "149/2", "Sachin Pawar", 4.1, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000018", "150/3", "Nisha Chavan", 1.8, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000019", "151/4", "Santosh More", 2.5, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000020", "152/1", "Radha Jadhav", 3.2, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000021", "153/2", "Ganesh Rane", 3.9, "Commercial", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000022", "154/3", "Swati Kadam", 1.6, "Agricultural", "PAID", "MEDIUM", "Satellite footprint alert", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000023", "155/4", "Mahesh Joshi", 2.3, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000024", "156/1", "Manasi Shinde", 3.0, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000025", "157/2", "Rohan Kulkarni", 3.7, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000026", "158/3", "Pramod Patil", 1.4, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000027", "159/4", "Deepak Thorat", 2.1, "Commercial", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000028", "160/1", "Varsha Jagtap", 2.8, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000029", "161/2", "Suresh Sawant", 3.5, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000030", "162/3", "Anita Salunkhe", 1.2, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000031", "163/4", "Nitin Bandal", 1.9, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000032", "164/1", "Smita Phadtare", 2.6, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000033", "165/2", "Ashok Dhamale", 3.3, "Commercial", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000034", "166/3", "Lata Marne", 4.0, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000035", "167/4", "Kiran Konde", 1.7, "Agricultural", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),
        createParcel("MH-27-PUN-000036", "168/1", "Tushar Barate", 2.4, "Residential", "PAID", "LOW", "No active civil litigation", "Maharashtra", "Pune", "Haveli", "Paud"),

        // TAMIL NADU SRIPERUMBUDUR PARCELS
        createParcel("TN-33-KCH-001-4412", "201/1A", "M. Shanmugam", 3.50, "Agricultural (Nanjai)", "PAID", "LOW", "No active civil litigation", "Tamil Nadu", "Kanchipuram", "Chengalpattu", "Sriperumbudur"),
        createParcel("TN-33-KCH-002-4412", "201/2A", "S. Valli", 4.00, "Agricultural (Nanjai)", "PAID", "LOW", "No active civil litigation", "Tamil Nadu", "Kanchipuram", "Chengalpattu", "Sriperumbudur"),
        createParcel("TN-33-KCH-003-4412", "201/3A", "R. Murugan", 4.50, "Agricultural (Nanjai)", "PAID", "LOW", "No active civil litigation", "Tamil Nadu", "Kanchipuram", "Chengalpattu", "Sriperumbudur"),
        createParcel("TN-33-KCH-004-4412", "201/4A", "K. Ramanathan", 5.00, "Agricultural (Nanjai)", "PAID", "LOW", "No active civil litigation", "Tamil Nadu", "Kanchipuram", "Chengalpattu", "Sriperumbudur"),
        createParcel("TN-33-KCH-005-4412", "201/5A", "P. Selvam", 5.50, "Agricultural (Nanjai)", "PAID", "LOW", "No active civil litigation", "Tamil Nadu", "Kanchipuram", "Chengalpattu", "Sriperumbudur"),

        // PUNJAB KHARAR PARCELS
        createParcel("PB-03-SAS-001-9921", "88/1", "Gurpreet Singh", 0.81, "Chahi (Irrigated)", "PAID", "LOW", "No active civil litigation", "Punjab", "Sahibzada Ajit Singh Nagar", "Kharar", "Kharar"),
        createParcel("PB-03-SAS-002-9921", "88/2", "Harpreet Kaur", 1.01, "Chahi (Irrigated)", "PAID", "LOW", "No active civil litigation", "Punjab", "Sahibzada Ajit Singh Nagar", "Kharar", "Kharar"),
        createParcel("PB-03-SAS-003-9921", "88/3", "Jasbir Singh", 1.21, "Chahi (Irrigated)", "PAID", "LOW", "No active civil litigation", "Punjab", "Sahibzada Ajit Singh Nagar", "Kharar", "Kharar")
    );

    @GetMapping
    public ResponseEntity<?> getParcels(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false) String bbox,
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        List<PublicParcelDTO> content = new ArrayList<>();

        for (Map<String, Object> pd : PARCELS_DATA) {
            String u = (String) pd.get("ulpin");
            content.add(new PublicParcelDTO(
                u,
                "MH-PAR-" + u.substring(Math.max(0, u.length() - 4)),
                (String) pd.getOrDefault("state", "Maharashtra"),
                (String) pd.getOrDefault("district", "Pune"),
                (String) pd.getOrDefault("taluka", "Haveli"),
                (String) pd.getOrDefault("village", "Paud"),
                (String) pd.get("surveyNo"),
                pd.get("areaHectare") + " Hectares",
                (String) pd.get("landType"),
                maskName((String) pd.get("ownerName"))
            ));
        }

        int start = Math.min(page * size, content.size());
        int end = Math.min(start + size, content.size());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("content", content.subList(start, end));
        res.put("page", page);
        res.put("size", size);
        res.put("totalElements", content.size());
        res.put("accessTier", principal.getRole());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{ulpin}")
    public ResponseEntity<?> getParcelByUlpin(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        Map<String, Object> target = findParcelData(ulpin);

        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable: No record found for ULPIN " + ulpin));
        }

        boolean isTn = ulpin.toUpperCase().contains("TN");
        boolean isPb = ulpin.toUpperCase().contains("PB");

        String state = (String) target.getOrDefault("state", isTn ? "Tamil Nadu" : (isPb ? "Punjab" : "Maharashtra"));
        String district = (String) target.getOrDefault("district", isTn ? "Kanchipuram" : (isPb ? "Sahibzada Ajit Singh Nagar" : "Pune"));
        String taluka = (String) target.getOrDefault("taluka", isTn ? "Chengalpattu" : (isPb ? "Kharar" : "Haveli"));
        String village = (String) target.getOrDefault("village", isTn ? "Sriperumbudur" : (isPb ? "Kharar" : "Paud"));
        String surveyNo = (String) target.get("surveyNo");
        String areaDisplay = target.get("areaHectare") + (isTn ? " Acres (Nanjai)" : (isPb ? " Kanal" : " Hectares"));
        String landType = (String) target.get("landType");
        String ownerName = (String) target.get("ownerName");
        String stateParcelId = isTn ? "TN-PAR-" + ulpin.substring(Math.max(0, ulpin.length() - 4)) : (isPb ? "PB-PAR-" + ulpin.substring(Math.max(0, ulpin.length() - 4)) : "MH-PAR-" + ulpin.substring(Math.max(0, ulpin.length() - 4)));
        String rorType = isTn ? "Patta & Chitta" : (isPb ? "Jamabandi Fard" : "7/12 Extract & 8A");

        // RESIDENT TIER ENFORCEMENT (Owner-to-Parcel Authorization)
        if (principal.isResident()) {
            boolean isOwner = isPersonOwnerOfParcel(principal.getPersonId(), ulpin);
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You are not an authorized owner or co-owner of parcel " + ulpin));
            }

            return ResponseEntity.ok(new ResidentParcelDTO(
                ulpin, stateParcelId, state, district, taluka, village,
                surveyNo, areaDisplay, landType, ownerName, 100.0, "SOLE", rorType
            ));
        }

        // GOVERNMENT / ADMIN TIER ENFORCEMENT
        if (principal.isGovernment() || principal.isAdmin()) {
            String taxStatus = (String) target.getOrDefault("taxStatus", "PAID");
            Double taxDues = "OVERDUE".equals(taxStatus) ? 8000.0 : 0.0;
            String disputeRisk = (String) target.getOrDefault("disputeRisk", "LOW");
            String disputeSummary = (String) target.getOrDefault("disputeSummary", "No active civil litigation");
            String clearance = "HIGH".equalsIgnoreCase(disputeRisk) ? "FLAGGED_HIGH_RISK" : "SYSTEM_CLEAR";

            Map<String, Object> aiEvaluation = aiGovernanceService.getParcelRiskSummary(ulpin);
            Map<String, Object> rawSource = Map.of("sourceState", state, "surveyNo", surveyNo, "ownerName", ownerName, "rorType", rorType);

            return ResponseEntity.ok(new GovernmentParcelDTO(
                ulpin, stateParcelId, state, district, taluka, village,
                surveyNo, areaDisplay, landType, ownerName, rorType,
                taxStatus, taxDues, disputeRisk, disputeSummary, clearance,
                aiEvaluation, rawSource
            ));
        }

        // PUBLIC TIER DEFAULT
        return ResponseEntity.ok(new PublicParcelDTO(
            ulpin, stateParcelId, state, district, taluka, village,
            surveyNo, areaDisplay, landType, ownerName
        ));
    }

    @GetMapping("/{ulpin}/summary")
    public ResponseEntity<?> getParcelSummary(@PathVariable String ulpin, HttpServletRequest request) {
        Map<String, Object> target = findParcelData(ulpin);
        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable for ULPIN " + ulpin));
        }

        boolean isTn = ulpin.toUpperCase().contains("TN");
        boolean isPb = ulpin.toUpperCase().contains("PB");
        String ownerName = (String) target.get("ownerName");

        return ResponseEntity.ok(new PublicParcelDTO(
            ulpin,
            "PAR-" + target.get("surveyNo"),
            (String) target.getOrDefault("state", isTn ? "Tamil Nadu" : (isPb ? "Punjab" : "Maharashtra")),
            (String) target.getOrDefault("district", isTn ? "Kanchipuram" : (isPb ? "SAS Nagar" : "Pune")),
            (String) target.getOrDefault("taluka", isTn ? "Chengalpattu" : (isPb ? "Kharar" : "Haveli")),
            (String) target.getOrDefault("village", isTn ? "Sriperumbudur" : (isPb ? "Kharar" : "Paud")),
            (String) target.get("surveyNo"),
            target.get("areaHectare") + (isTn ? " Acres" : " Hectares"),
            (String) target.get("landType"),
            ownerName
        ));
    }

    @GetMapping("/{ulpin}/timeline")
    public ResponseEntity<?> getParcelTimeline(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            boolean isOwner = principal.isResident() && isPersonOwnerOfParcel(principal.getPersonId(), ulpin);
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You are not authorized to view the timeline log for parcel " + ulpin));
            }
        }

        Map<String, Object> target = findParcelData(ulpin);
        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable for ULPIN " + ulpin));
        }

        List<Map<String, Object>> timeline = new ArrayList<>();

        Map<String, Object> t1 = new LinkedHashMap<>();
        t1.put("year", "2018");
        t1.put("date", "2018-04-12");
        t1.put("event", "Initial Cadastral Land Survey & Revenue Settlement");
        t1.put("details", "DGPS boundary measurement completed for Plot #" + target.get("surveyNo") + " by Survey Dept. High-precision PostGIS polygon recorded.");
        t1.put("category", "SURVEY");
        t1.put("actor", "Department of Land Records");
        timeline.add(t1);

        Map<String, Object> t2 = new LinkedHashMap<>();
        t2.put("year", "2020");
        t2.put("date", "2020-09-18");
        t2.put("event", "Sub-Registrar Office Deed Registration");
        t2.put("details", "Deed registered under Khatedar " + target.get("ownerName") + ". Stamp Duty & Fees Paid.");
        t2.put("category", "REGISTRATION");
        t2.put("actor", "Sub-Registrar Office");
        timeline.add(t2);

        Map<String, Object> t3 = new LinkedHashMap<>();
        t3.put("year", "2021");
        t3.put("date", "2021-02-05");
        t3.put("event", "Mutation Sanction & RoR Entry");
        t3.put("details", "Tahsildar approved Mutation Entry. Record of Rights updated under Khatedar " + target.get("ownerName") + ".");
        t3.put("category", "MUTATION");
        t3.put("actor", "Revenue Office");
        timeline.add(t3);

        Map<String, Object> t4 = new LinkedHashMap<>();
        t4.put("year", "2023");
        t4.put("date", "2023-11-20");
        t4.put("event", "ULPIN Digital Certificate Assignment");
        t4.put("details", "Unique Land Parcel Identification Number (ULPIN: " + ulpin + ") issued under Bhu-Aadhaar National DPI Protocol.");
        t4.put("category", "DPI_ASSIGNMENT");
        t4.put("actor", "LAND STACK DPI Engine");
        timeline.add(t4);

        Map<String, Object> t5 = new LinkedHashMap<>();
        t5.put("year", "2025");
        t5.put("date", "2025-03-31");
        t5.put("event", "Annual Property Tax & Land Revenue Clearance");
        t5.put("details", "Tax status: " + target.get("taxStatus") + ". Digital e-Receipt recorded on blockchain ledger.");
        t5.put("category", "TAX");
        t5.put("actor", "Revenue Office");
        timeline.add(t5);

        return ResponseEntity.ok(timeline);
    }

    @GetMapping("/{ulpin}/registrations")
    public ResponseEntity<?> getParcelRegistrations(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            boolean isOwner = principal.isResident() && isPersonOwnerOfParcel(principal.getPersonId(), ulpin);
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You are not authorized to view registration records for parcel " + ulpin));
            }
        }

        Map<String, Object> target = findParcelData(ulpin);
        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable for ULPIN " + ulpin));
        }

        Map<String, Object> reg = new LinkedHashMap<>();
        reg.put("deedNumber", "SRO/REG/" + ulpin.substring(Math.max(0, ulpin.length() - 6)));
        reg.put("registrationDate", "2020-09-18");
        reg.put("subRegistrarOffice", "Sub-Registrar Office, District " + target.getOrDefault("district", "Pune"));
        reg.put("bookNumber", "Book 1 (Deeds of Conveyance)");
        reg.put("volumeNumber", "Volume 1402, Pages 112–128");
        reg.put("deedType", "Registered Sale Deed & Absolute Conveyance");
        reg.put("stampDutyPaid", "₹1,85,000");
        reg.put("registrationFeePaid", "₹30,000");
        reg.put("executants", Arrays.asList(target.get("ownerName") + " (Purchaser / Khatedar)", "Former Khatedar Owner (Vendor)"));
        reg.put("witnesses", Arrays.asList("Local Revenue Witness 1", "Local Revenue Witness 2"));
        reg.put("status", "REGISTERED_AND_VERIFIED");

        return ResponseEntity.ok(Collections.singletonList(reg));
    }

    @GetMapping("/{ulpin}/documents")
    public ResponseEntity<?> getParcelDocuments(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            boolean isOwner = principal.isResident() && isPersonOwnerOfParcel(principal.getPersonId(), ulpin);
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You are not authorized to view documents for parcel " + ulpin));
            }
        }

        Map<String, Object> target = findParcelData(ulpin);
        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable for ULPIN " + ulpin));
        }

        boolean isTn = ulpin.toUpperCase().contains("TN");
        boolean isPb = ulpin.toUpperCase().contains("PB");

        String rorTitle = isTn ? "Official Patta & Chitta Extract PDF" : (isPb ? "Official Jamabandi Fard Extract PDF" : "Official 7/12 & 8A RoR Record Extract PDF");

        List<Map<String, Object>> docs = new ArrayList<>();

        Map<String, Object> d1 = new LinkedHashMap<>();
        d1.put("id", "DOC-ROR-001");
        d1.put("title", rorTitle + " (" + target.get("ownerName") + ")");
        d1.put("category", "RECORD_OF_RIGHTS");
        d1.put("issuedBy", "Revenue Department");
        d1.put("issueDate", "2026-01-15");
        d1.put("fileSize", "1.2 MB");
        d1.put("status", "DIGITALLY_SIGNED");
        docs.add(d1);

        Map<String, Object> d2 = new LinkedHashMap<>();
        d2.put("id", "DOC-DEED-002");
        d2.put("title", "Registered Sale Deed & Conveyance (Sub-Registrar Certified Copy)");
        d2.put("category", "DEED_REGISTRATION");
        d2.put("issuedBy", "Sub-Registrar Office");
        d2.put("issueDate", "2020-09-18");
        d2.put("fileSize", "3.4 MB");
        d2.put("status", "VERIFIED_SRO");
        docs.add(d2);

        Map<String, Object> d3 = new LinkedHashMap<>();
        d3.put("id", "DOC-MUT-003");
        d3.put("title", "Approved Mutation Certificate Entry PDF");
        d3.put("category", "MUTATION");
        d3.put("issuedBy", "Revenue Office");
        d3.put("issueDate", "2021-02-05");
        d3.put("fileSize", "850 KB");
        d3.put("status", "SANCTIONED");
        docs.add(d3);

        Map<String, Object> d4 = new LinkedHashMap<>();
        d4.put("id", "DOC-SURVEY-004");
        d4.put("title", "DGPS Cadastral Boundary Map & Coordinate Sheet PDF (Plot " + target.get("surveyNo") + ")");
        d4.put("category", "SPATIAL_MAP");
        d4.put("issuedBy", "Directorate of Settlement & Land Records");
        d4.put("issueDate", "2023-11-20");
        d4.put("fileSize", "2.1 MB");
        d4.put("status", "GEO_VERIFIED");
        docs.add(d4);

        return ResponseEntity.ok(docs);
    }

    @GetMapping("/{ulpin}/compliance")
    public ResponseEntity<?> getParcelComplianceStatus(@PathVariable String ulpin, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            boolean isOwner = principal.isResident() && isPersonOwnerOfParcel(principal.getPersonId(), ulpin);
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You are not authorized to view compliance status for parcel " + ulpin));
            }
        }

        Map<String, Object> target = findParcelData(ulpin);
        if (target == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Parcel Information Unavailable for ULPIN " + ulpin));
        }

        String taxStatus = (String) target.get("taxStatus");
        String disputeRisk = (String) target.get("disputeRisk");

        Map<String, Object> comp = new LinkedHashMap<>();
        comp.put("ulpin", ulpin);
        comp.put("overallCompliance", "HIGH".equalsIgnoreCase(disputeRisk) ? "ATTENTION_REQUIRED" : "FULLY_COMPLIANT");
        comp.put("titleVerification", "VERIFIED_KHATEDAR");
        comp.put("sroDeedLinkage", "SRO_CERTIFIED_LINKED");
        comp.put("encumbranceStatus", "HIGH".equalsIgnoreCase(disputeRisk) ? "REVENUE_INQUIRY_OPEN" : "NO_ACTIVE_COURT_INJUNCTION");
        comp.put("taxCompliance", "PAID".equalsIgnoreCase(taxStatus) ? "TAX_PAID_IN_FULL" : "PROPERTY_TAX_ARREARS");
        comp.put("spatialBoundaryVerification", "DGPS_CADASTRAL_VERIFIED");

        List<Map<String, String>> factors = new ArrayList<>();
        factors.add(Map.of(
            "title", "Khatedar Ownership Verification",
            "status", "COMPLIANT",
            "description", "Record of Rights (7/12 & 8A / Patta) matches Tahsildar land register for " + target.get("ownerName") + "."
        ));
        factors.add(Map.of(
            "title", "Sub-Registrar Conveyance Deed Linkage",
            "status", "COMPLIANT",
            "description", "Sale Deed for Plot #" + target.get("surveyNo") + " is registered and cross-linked."
        ));

        if ("OVERDUE".equalsIgnoreCase(taxStatus)) {
            factors.add(Map.of(
                "title", "Property Tax Dues",
                "status", "ATTENTION",
                "description", "₹8,000 overdue property tax arrears outstanding. Clear dues via Resident Portal."
            ));
        } else {
            factors.add(Map.of(
                "title", "Property Tax Dues",
                "status", "COMPLIANT",
                "description", "Annual property tax paid in full. No outstanding revenue dues."
            ));
        }

        if ("HIGH".equalsIgnoreCase(disputeRisk)) {
            factors.add(Map.of(
                "title", "Boundary & Title Inquiry",
                "status", "ATTENTION",
                "description", (String) target.get("disputeSummary")
            ));
        } else {
            factors.add(Map.of(
                "title", "Encumbrances & Litigation",
                "status", "COMPLIANT",
                "description", "Zero active court stay orders, bank mortgages, or title encumbrances recorded."
            ));
        }

        comp.put("complianceFactors", factors);

        return ResponseEntity.ok(comp);
    }

    private boolean isPersonOwnerOfParcel(String personId, String ulpin) {
        if (personId == null || ulpin == null) return false;
        if ("LS-PER-00000125".equalsIgnoreCase(personId)) {
            return ulpin.contains("000001") || ulpin.contains("000003") || ulpin.contains("000847") || ulpin.contains("MH-27-PUN-000001") || ulpin.contains("MH-27-PUN-000003");
        }
        if ("LS-PER-00000341".equalsIgnoreCase(personId)) {
            return ulpin.contains("000003");
        }
        if ("LS-PER-00000512".equalsIgnoreCase(personId)) {
            return ulpin.toUpperCase().contains("TN");
        }
        List<Ownership> ownList = personService.getOwnershipsForPerson(personId);
        for (Ownership o : ownList) {
            if (o.getUlpin().equalsIgnoreCase(ulpin) || ulpin.endsWith(o.getUlpin())) return true;
        }
        return false;
    }

    private Map<String, Object> findParcelData(String ulpin) {
        if (ulpin == null || ulpin.trim().isEmpty()) return null;
        String trimmed = ulpin.trim();

        for (Map<String, Object> p : PARCELS_DATA) {
            String u = (String) p.get("ulpin");
            if (u.equalsIgnoreCase(trimmed)) {
                return p;
            }
        }
        // Match partial suffix if standard format
        for (Map<String, Object> p : PARCELS_DATA) {
            String u = (String) p.get("ulpin");
            if (trimmed.length() >= 6 && u.endsWith(trimmed.substring(trimmed.length() - 6))) {
                return p;
            }
        }
        // NO DEFAULT FALLBACK! Return null if ULPIN not found in dataset.
        return null;
    }

    private String maskName(String name) {
        if (name == null) return "Unknown";
        String[] parts = name.split(" ");
        if (parts.length > 1) {
            return parts[0] + " " + parts[1].substring(0, 1) + "***";
        }
        return name.substring(0, Math.min(2, name.length())) + "***";
    }
}
