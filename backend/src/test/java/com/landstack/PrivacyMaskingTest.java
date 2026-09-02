package com.landstack;

import com.landstack.service.PrivacyMaskingService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PrivacyMaskingTest {

    @Test
    public void testPiiOwnerNameMasking() {
        PrivacyMaskingService maskingService = new PrivacyMaskingService();

        String masked1 = maskingService.maskOwnerName("Rahul Anil Deshmukh");
        assertEquals("R. A. D*******", masked1);

        String masked2 = maskingService.maskOwnerName("Vijay Jadhav");
        assertEquals("V. J*****", masked2);

        String maskedPhone = maskingService.maskPhone("9823011245");
        assertEquals("+91 ***** 11245", maskedPhone);

        String maskedEmail = maskingService.maskEmail("rahul.deshmukh@gmail.com");
        assertEquals("r*****@gmail.com", maskedEmail);
    }
}
