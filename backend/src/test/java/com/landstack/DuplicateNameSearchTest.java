package com.landstack;

import com.landstack.entity.Person;
import com.landstack.service.AuditService;
import com.landstack.service.PersonService;
import com.landstack.service.SecurityEventService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DuplicateNameSearchTest {

    @Test
    public void testDuplicateNameSearchReturnsDistinctPersonIDs() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);

        // Search "Rahul Anil Deshmukh" -> Must return 2 distinct Person records (Haveli & Mulshi)
        List<Person> results = personService.searchPersons("Rahul Anil Deshmukh", null, null, null, null, null, null, "GOV_ADMIN", "ALL");

        assertEquals(2, results.size());
        assertNotEquals(results.get(0).getPersonId(), results.get(1).getPersonId());
        assertTrue(results.stream().anyMatch(p -> "LS-PER-00000125".equals(p.getPersonId())));
        assertTrue(results.stream().anyMatch(p -> "LS-PER-00000487".equals(p.getPersonId())));
    }
}
