package com.landstack.service;

import com.landstack.entity.Person;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PersonMatchingService {

    public Map<String, Object> evaluateMatch(String incomingName, String incomingJurisdiction, List<Person> existingPersons) {
        Map<String, Object> result = new LinkedHashMap<>();
        String normalizedIncoming = incomingName.replaceAll("\\s+", " ").trim().toUpperCase();

        List<Map<String, Object>> matches = new ArrayList<>();
        for (Person p : existingPersons) {
            if (p.getNormalizedName().equalsIgnoreCase(normalizedIncoming)) {
                boolean sameJurisdiction = (p.getTalukaId() + "-" + p.getVillageId()).equalsIgnoreCase(incomingJurisdiction);
                double confidence = sameJurisdiction ? 94.0 : 72.0;

                Map<String, Object> m = new LinkedHashMap<>();
                m.put("personId", p.getPersonId());
                m.put("name", p.getName());
                m.put("jurisdiction", p.getDistrictId() + " / " + p.getTalukaId() + " / " + p.getVillageId());
                m.put("matchLevel", sameJurisdiction ? "LEVEL_4_NAME_JURISDICTION" : "LEVEL_4_NAME_ONLY");
                m.put("confidencePercent", confidence);
                m.put("status", confidence > 90.0 ? "POSSIBLE_MATCH" : "WEAK_MATCH");
                matches.add(m);
            }
        }

        result.put("incomingName", incomingName);
        result.put("candidateMatchesCount", matches.size());
        result.put("candidateMatches", matches);
        result.put("recommendation", matches.size() > 1 ? "REQUIRES_HUMAN_REVIEW" : (matches.size() == 1 ? "POSSIBLE_LINKAGE" : "CREATE_NEW_PERSON"));

        return result;
    }
}
