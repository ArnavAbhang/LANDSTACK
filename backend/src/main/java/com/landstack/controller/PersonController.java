package com.landstack.controller;

import com.landstack.entity.Ownership;
import com.landstack.entity.Person;
import com.landstack.service.PersonMatchingService;
import com.landstack.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class PersonController {

    private final PersonService personService;
    private final PersonMatchingService matchingService;

    @Autowired
    public PersonController(PersonService personService, PersonMatchingService matchingService) {
        this.personService = personService;
        this.matchingService = matchingService;
    }

    @GetMapping("/persons/search")
    public ResponseEntity<?> searchPersons(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String personId,
            @RequestParam(required = false) String stateCode,
            @RequestParam(required = false) String districtId,
            @RequestParam(required = false) String talukaId,
            @RequestParam(required = false) String villageId,
            @RequestParam(required = false) String ulpin,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole,
            @RequestHeader(value = "X-User-Taluka", required = false, defaultValue = "Haveli") String userTaluka) {

        List<Person> results = personService.searchPersons(name, personId, stateCode, districtId, talukaId, villageId, ulpin, userRole, userTaluka);

        // Apply Privacy Masking for Public Users
        List<Map<String, Object>> responseList = new ArrayList<>();
        boolean isPublic = "PUBLIC".equalsIgnoreCase(userRole);

        for (Person p : results) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("personId", isPublic ? "MASKED-PER-ID" : p.getPersonId());
            map.put("name", p.getName());
            map.put("email", isPublic ? "m***@example.com" : p.getEmail());
            map.put("phone", isPublic ? "+91 98*** ****" : p.getPhone());
            map.put("address", isPublic ? "Masked Address" : p.getAddress());
            map.put("stateCode", p.getStateCode());
            map.put("districtId", p.getDistrictId());
            map.put("talukaId", p.getTalukaId());
            map.put("villageId", p.getVillageId());
            map.put("identityStatus", p.getIdentityStatus());

            List<Ownership> ownList = personService.getOwnershipsForPerson(p.getPersonId());
            map.put("authorizedParcelCount", ownList.size());
            map.put("activeParcelCount", ownList.stream().filter(o -> "ACTIVE".equalsIgnoreCase(o.getStatus())).count());

            responseList.add(map);
        }

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/persons/{personId}")
    public ResponseEntity<?> getPersonById(
            @PathVariable String personId,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "PUBLIC") String userRole,
            @RequestHeader(value = "X-User-Taluka", required = false, defaultValue = "Haveli") String userTaluka) {

        Person p = personService.getPersonById(personId, userRole, userTaluka);
        if (p == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Denied: Person record not found or outside authorized officer jurisdiction."));
        }

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("personId", p.getPersonId());
        map.put("name", p.getName());
        map.put("email", p.getEmail());
        map.put("phone", p.getPhone());
        map.put("address", p.getAddress());
        map.put("stateCode", p.getStateCode());
        map.put("districtId", p.getDistrictId());
        map.put("talukaId", p.getTalukaId());
        map.put("villageId", p.getVillageId());
        map.put("identityStatus", p.getIdentityStatus());

        List<Ownership> ownList = personService.getOwnershipsForPerson(personId);
        map.put("ownerships", ownList);
        map.put("authorizedParcelCount", ownList.size());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/persons/{personId}/ownerships")
    public ResponseEntity<List<Ownership>> getPersonOwnerships(@PathVariable String personId) {
        return ResponseEntity.ok(personService.getOwnershipsForPerson(personId));
    }

    @GetMapping("/parcels/{ulpin}/owners")
    public ResponseEntity<List<Ownership>> getParcelOwners(@PathVariable String ulpin) {
        return ResponseEntity.ok(personService.getOwnersForUlpin(ulpin));
    }

    @PostMapping("/persons/match")
    public ResponseEntity<?> matchPerson(@RequestBody Map<String, String> payload) {
        String incomingName = payload.getOrDefault("name", "");
        String incomingJurisdiction = payload.getOrDefault("jurisdiction", "");

        List<Person> allPersons = personService.searchPersons(null, null, null, null, null, null, null, "GOV_ADMIN", "ALL");
        Map<String, Object> matchResult = matchingService.evaluateMatch(incomingName, incomingJurisdiction, allPersons);

        return ResponseEntity.ok(matchResult);
    }
}
