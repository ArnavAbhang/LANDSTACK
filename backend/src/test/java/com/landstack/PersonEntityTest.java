package com.landstack;

import com.landstack.entity.Person;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PersonEntityTest {

    @Test
    public void testPersonEntityCreationAndNormalization() {
        Person p = new Person("LS-PER-00000125", "Rahul Anil Deshmukh", "rahul@example.com", "+91 98220 11223", "Paud, Pune", "MH", "Pune", "Haveli", "Paud");

        assertEquals("LS-PER-00000125", p.getPersonId());
        assertEquals("Rahul Anil Deshmukh", p.getName());
        assertEquals("RAHUL ANIL DESHMUKH", p.getNormalizedName());
        assertEquals("Haveli", p.getTalukaId());
    }
}
