package com.landstack;

import com.landstack.entity.Ownership;
import com.landstack.service.AuditService;
import com.landstack.service.PersonService;
import com.landstack.service.SecurityEventService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OwnershipRelationshipTest {

    @Test
    public void testOnePersonMultipleParcelsAndJointOwnership() {
        AuditService auditService = new AuditService();
        SecurityEventService securityEventService = new SecurityEventService();
        PersonService personService = new PersonService(auditService, securityEventService);

        // Person 1 (LS-PER-00000125) owns 3 parcels (MH-27-PUN-000003, MH-27-PUN-000847, MH-27-PUN-001204)
        List<Ownership> rahulOwns = personService.getOwnershipsForPerson("LS-PER-00000125");
        assertEquals(3, rahulOwns.size());

        // ULPIN MH-27-PUN-000003 has 2 joint owners (Rahul 70% share, Sneha 30% share)
        List<Ownership> parcelOwners = personService.getOwnersForUlpin("MH-27-PUN-000003");
        assertEquals(2, parcelOwners.size());
        assertEquals(70.0, parcelOwners.get(0).getOwnershipShare());
        assertEquals(30.0, parcelOwners.get(1).getOwnershipShare());
    }
}
