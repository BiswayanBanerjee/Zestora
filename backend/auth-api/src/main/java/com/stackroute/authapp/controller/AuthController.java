package com.stackroute.authapp.controller;

import com.stackroute.authapp.model.User;
import com.stackroute.authapp.service.GenerateJwt;
import com.stackroute.authapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth-app")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://zestora-9kan.onrender.com"  // ✅ Render frontend URL
    },
    allowCredentials = "true"
)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private GenerateJwt generateJwt; // Make sure this points to the correct GenerateJwt implementation


    // User logout (token should be cleared on client-side)
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Logic for logout can be added if tracking tokens is needed
        return ResponseEntity.ok("Logout successful");
    }

    // Password reset (user must provide current password and new password)
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> passwordData) {
        String email = passwordData.get("email");
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        // Validate the user's current password
        User authenticatedUser = userService.loginCheck(email, currentPassword);
        if (authenticatedUser != null) {
            // Update password
            authenticatedUser.setPassword(newPassword);
            userService.addUser(authenticatedUser);  // Save the updated user with the new password
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(401).body("Current password is incorrect");
        }
    }

    // Optionally, you could add more functionality like forgot password (send a reset link) if required
}
