package com.landstack.service;

import org.springframework.stereotype.Service;

@Service
public class PrivacyMaskingService {

    /**
     * Masks full owner name for public users.
     * Example: "Rahul Anil Deshmukh" -> "R. A. D******"
     * Example: "Vijay Jadhav" -> "V. J*****"
     */
    public String maskOwnerName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "P****** H*****";
        }

        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, 1) + "*****";
        }

        StringBuilder masked = new StringBuilder();
        for (int i = 0; i < parts.length - 1; i++) {
            masked.append(parts[i].charAt(0)).append(". ");
        }
        String lastPart = parts[parts.length - 1];
        masked.append(lastPart.charAt(0));
        int stars = Math.max(3, lastPart.length() - 1);
        for (int s = 0; s < stars; s++) {
            masked.append("*");
        }

        return masked.toString();
    }

    /**
     * Masks mobile phone number for public users.
     * Example: "9823011245" -> "+91 ***** 11245"
     */
    public String maskPhone(String phone) {
        if (phone == null || phone.length() < 5) {
            return "+91 ***** *****";
        }
        return "+91 ***** " + phone.substring(phone.length() - 5);
    }

    /**
     * Masks email address for public users.
     * Example: "rahul.deshmukh@gmail.com" -> "r*****@gmail.com"
     */
    public String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "user*****@landstack.gov.in";
        }
        String[] parts = email.split("@");
        String username = parts[0];
        String domain = parts[1];
        return username.charAt(0) + "*****@" + domain;
    }
}
