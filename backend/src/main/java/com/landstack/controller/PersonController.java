package com.landstack.controller;

import com.landstack.entity.Ownership;
import com.landstack.entity.Person;
import com.landstack.security.AuthPrincipal;
import com.landstack.security.SecurityContextResolver;
import com.landstack.service.PersonMatchingService;
import com.landstack.service.PersonService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: Land Owner Search is restricted to authorized Government Officials."));
        }

        List<Person> results = personService.searchPersons(name, personId, stateCode, districtId, talukaId, villageId, ulpin, principal.getRole(), principal.getTalukaId());

        List<Map<String, Object>> responseList = new ArrayList<>();
        for (Person p : results) {
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
            HttpServletRequest request) {

        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);

        if (principal.isResident()) {
            if (!personId.equalsIgnoreCase(principal.getPersonId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: Citizens can only access their own authenticated profile."));
            }
        } else if (!principal.isGovernment() && !principal.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: Unauthenticated or unauthorized access."));
        }

        Person p = personService.getPersonById(personId, principal.getRole(), principal.getTalukaId());
        if (p == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access Denied: Person record not found or outside authorized officer jurisdiction."));
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
    public ResponseEntity<?> getPersonOwnerships(@PathVariable String personId, HttpServletRequest request) {
        AuthPrincipal principal = SecurityContextResolver.resolvePrincipal(request);
        if (principal.isResident() && !personId.equalsIgnoreCase(principal.getPersonId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Access Denied: Citizens can only access their own ownership holdings."));
        }
        return ResponseEntity.ok(personService.getOwnershipsForPerson(personId));
    }
}
