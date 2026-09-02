package com.landstack;

import com.landstack.entity.Person;
import com.landstack.service.AuditService;
import com.landstack.service.PersonService;
import com.landstack.service.SecurityEventService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PersonJurisdictionTest {

    @Test
    public void testOfficerJurisdictionScoping() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);

        // Haveli Revenue Officer searches "Rahul Anil Deshmukh" -> Should only see Haveli person (LS-PER-00000125)
        List<Person> haveliResults = personService.searchPersons("Rahul Anil Deshmukh", null, null, null, null, null, null, "REVENUE_OFFICER", "Haveli");
        assertEquals(1, haveliResults.size());
        assertEquals("LS-PER-00000125", haveliResults.get(0).getPersonId());

        // Attempting to directly fetch Mulshi Person ID (LS-PER-00000487) as Haveli officer -> Returns null & triggers SecurityEvent
        Person forbidden = personService.getPersonById("LS-PER-00000487", "REVENUE_OFFICER", "Haveli");
        assertNull(forbidden);
    }
}
