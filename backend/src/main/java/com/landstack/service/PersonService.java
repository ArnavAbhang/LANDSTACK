package com.landstack.service;

import com.landstack.entity.Ownership;
import com.landstack.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class PersonService {

    private final List<Person> persons = new CopyOnWriteArrayList<>();
    private final List<Ownership> ownerships = new CopyOnWriteArrayList<>();
    private final AuditService auditService;
    private final SecurityEventService securityEventService;

    @Autowired
    public PersonService(AuditService auditService, SecurityEventService securityEventService) {
        this.auditService = auditService;
        this.securityEventService = securityEventService;

        // Seed Sample Person Data
        // Person 1: Rahul Anil Deshmukh (Haveli) - Owns 3 parcels
        Person p1 = new Person("LS-PER-00000125", "Rahul Anil Deshmukh", "rahul.deshmukh@example.com", "+91 98220 11223", "Plot 42, Green Avenue, Paud Road, Pune", "MH", "Pune", "Haveli", "Paud");
        persons.add(p1);

        // Person 2: Sneha Deshmukh (Haveli) - Joint owner with Rahul on MH-27-PUN-000003
        Person p2 = new Person("LS-PER-00000341", "Sneha Deshmukh", "sneha.deshmukh@example.com", "+91 98220 33445", "Plot 42, Green Avenue, Paud Road, Pune", "MH", "Pune", "Haveli", "Paud");
        persons.add(p2);

        // Person 3: Rahul Anil Deshmukh (Mulshi) - DUPLICATE NAME, Different Person ID
        Person p3 = new Person("LS-PER-00000487", "Rahul Anil Deshmukh", "rahul.mulshi@example.com", "+91 98220 77889", "House 18, Main Market, Pirangut, Pune", "MH", "Pune", "Mulshi", "Pirangut");
        persons.add(p3);

        // Person 4: M. Shanmugam (Chengalpattu, Tamil Nadu)
        Person p4 = new Person("LS-PER-00000512", "M. Shanmugam", "m.shanmugam@example.com", "+91 94440 99887", "No 14, Temple Street, Sriperumbudur, Kanchipuram", "TN", "Kanchipuram", "Chengalpattu", "Sriperumbudur");
        persons.add(p4);

        // Person 5: Gurpreet Singh (SAS Nagar, Punjab)
        Person p5 = new Person("LS-PER-00000620", "Gurpreet Singh", "gurpreet.pb@example.com", "+91 98140 55443", "VPO Kharar, Sector 4, SAS Nagar", "PB", "SAS Nagar", "Kharar", "Kharar");
        persons.add(p5);

        // Seed Sample Ownership Relationships
        // Rahul Deshmukh (Haveli) - Joint 70% share on MH-27-PUN-000003 (Disputed)
        ownerships.add(new Ownership("OWN-001", "LS-PER-00000125", "MH-27-PUN-000003", "JOINT", 70.0, "DISPUTED", "Maharashtra", "MahaBhulekh 7/12 Extract"));
        // Sneha Deshmukh (Haveli) - Joint 30% share on MH-27-PUN-000003
        ownerships.add(new Ownership("OWN-002", "LS-PER-00000341", "MH-27-PUN-000003", "JOINT", 30.0, "ACTIVE", "Maharashtra", "MahaBhulekh 7/12 Extract"));

        // Rahul Deshmukh (Haveli) - Sole owner of MH-27-PUN-000847 (Active)
        ownerships.add(new Ownership("OWN-003", "LS-PER-00000125", "MH-27-PUN-000847", "SOLE", 100.0, "ACTIVE", "Maharashtra", "MahaBhulekh 7/12 Extract"));

        // Rahul Deshmukh (Haveli) - Historical owner of MH-27-PUN-001204
        ownerships.add(new Ownership("OWN-004", "LS-PER-00000125", "MH-27-PUN-001204", "SOLE", 100.0, "HISTORICAL", "Maharashtra", "MahaBhulekh 7/12 Extract"));

        // Rahul Deshmukh (Mulshi) - Sole owner of MH-27-PUN-001512
        ownerships.add(new Ownership("OWN-005", "LS-PER-00000487", "MH-27-PUN-001512", "SOLE", 100.0, "ACTIVE", "Maharashtra", "MahaBhulekh 7/12 Extract"));

        // M. Shanmugam - Sole owner of TN-33-KCH-001-4412
        ownerships.add(new Ownership("OWN-006", "LS-PER-00000512", "TN-33-KCH-001-4412", "SOLE", 100.0, "ACTIVE", "Tamil Nadu", "Tamil Nilam Patta"));

        // Gurpreet Singh - Sole owner of PB-03-SAS-001-9921
        ownerships.add(new Ownership("OWN-007", "LS-PER-00000620", "PB-03-SAS-001-9921", "SOLE", 100.0, "ACTIVE", "Punjab", "PLRS Jamabandi"));
    }

    public List<Person> searchPersons(String name, String personId, String stateCode, String districtId, String talukaId, String villageId, String ulpin, String userRole, String userTaluka) {
        List<Person> matches = new ArrayList<>();
        String nameUpper = name != null ? name.trim().toUpperCase() : "";

        // Enforce JBAC Jurisdiction Access Control for Government Officers
        boolean isGovOfficer = "REVENUE_OFFICER".equalsIgnoreCase(userRole) || "TALATHI".equalsIgnoreCase(userRole) || "TAHSILDAR".equalsIgnoreCase(userRole);

        for (Person p : persons) {
            // Apply JBAC Jurisdiction filter if officer
            if (isGovOfficer && userTaluka != null && !userTaluka.isEmpty() && !userTaluka.equalsIgnoreCase("ALL") && !p.getTalukaId().equalsIgnoreCase(userTaluka)) {
                continue; // Scope to officer jurisdiction
            }

            boolean match = false;
            if (personId != null && !personId.isEmpty() && p.getPersonId().equalsIgnoreCase(personId.trim())) {
                match = true;
            } else if (nameUpper != null && !nameUpper.isEmpty() && p.getNormalizedName().contains(nameUpper)) {
                match = true;
            } else if (ulpin != null && !ulpin.isEmpty()) {
                for (Ownership o : ownerships) {
                    if (o.getUlpin().equalsIgnoreCase(ulpin.trim()) && o.getPersonId().equals(p.getPersonId())) {
                        match = true;
                        break;
                    }
                }
            } else if ((name == null || name.isEmpty()) && (personId == null || personId.isEmpty())) {
                match = true;
            }

            if (match) matches.add(p);
        }

        // Audit Search Event
        auditService.logAction("OFFICER-SESSION", userRole != null ? userRole : "PUBLIC", "PERSON_SEARCH", "PERSON_SEARCH_EXECUTED", "PERSON", "SEARCH-QUERY", userTaluka != null ? userTaluka : "GLOBAL", "N/A", "Person search executed for query: " + (name != null ? name : personId), "LOW", "Person Search Engine");

        return matches;
    }

    public Person getPersonById(String personId, String userRole, String userTaluka) {
        for (Person p : persons) {
            if (p.getPersonId().equalsIgnoreCase(personId)) {
                // JBAC Check
                boolean isGovOfficer = "REVENUE_OFFICER".equalsIgnoreCase(userRole) || "TALATHI".equalsIgnoreCase(userRole) || "TAHSILDAR".equalsIgnoreCase(userRole);
                if (isGovOfficer && userTaluka != null && !userTaluka.isEmpty() && !userTaluka.equalsIgnoreCase("ALL") && !p.getTalukaId().equalsIgnoreCase(userTaluka)) {
                    securityEventService.logEvent("GOV_OFFICER", userRole, "UNAUTHORIZED_JURISDICTION_ACCESS", "HIGH", "Attempted to view person outside assigned jurisdiction: " + p.getTalukaId(), personId);
                    return null;
                }

                auditService.logAction("OFFICER-SESSION", userRole != null ? userRole : "PUBLIC", "PERSON_DOSSIER", "OWNER_DOSSIER_VIEW", "PERSON", personId, p.getTalukaId(), "N/A", "Owner dossier accessed for Person ID: " + personId, "MEDIUM", "Person Service");
                return p;
            }
        }
        return null;
    }

    public List<Ownership> getOwnershipsForPerson(String personId) {
        List<Ownership> result = new ArrayList<>();
        for (Ownership o : ownerships) {
            if (o.getPersonId().equalsIgnoreCase(personId)) {
                result.add(o);
            }
        }
        return result;
    }

    public List<Ownership> getOwnersForUlpin(String ulpin) {
        List<Ownership> result = new ArrayList<>();
        for (Ownership o : ownerships) {
            if (o.getUlpin().equalsIgnoreCase(ulpin)) {
                result.add(o);
            }
        }
        return result;
    }
}
