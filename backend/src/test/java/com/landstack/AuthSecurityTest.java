package com.landstack;

import com.landstack.controller.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AuthSecurityTest {

    @Test
    public void testResidentLoginSuccess() {
        AuthController controller = new AuthController();
        Map<String, String> body = Map.of("email", "resident@example.com", "password", "password123", "portal", "RESIDENT");

        ResponseEntity<?> response = controller.login(body);
        assertEquals(200, response.getStatusCodeValue());

        Map<?, ?> result = (Map<?, ?>) response.getBody();
        assertNotNull(result.get("token"));
        Map<?, ?> user = (Map<?, ?>) result.get("user");
        assertEquals("RESIDENT", user.get("role"));
    }

    @Test
    public void testGovernmentOfficerLoginSuccess() {
        AuthController controller = new AuthController();
        Map<String, String> body = Map.of("email", "revenue.officer@example.gov", "password", "admin123", "portal", "GOVERNMENT");

        ResponseEntity<?> response = controller.login(body);
        assertEquals(200, response.getStatusCodeValue());

        Map<?, ?> result = (Map<?, ?>) response.getBody();
        Map<?, ?> user = (Map<?, ?>) result.get("user");
        assertEquals("REVENUE_OFFICER", user.get("role"));
        assertEquals("REVENUE", user.get("department"));
    }
}
