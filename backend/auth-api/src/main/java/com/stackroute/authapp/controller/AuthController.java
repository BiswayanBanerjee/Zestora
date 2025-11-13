package com.stackroute.authapp.controller;

import com.stackroute.authapp.model.User;
import com.stackroute.authapp.service.GenerateJwt;
import com.stackroute.authapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth-app")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://zestora-9kan.onrender.com" // ✅ Render frontend URL
}, allowCredentials = "true")
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
            userService.addUser(authenticatedUser); // Save the updated user with the new password
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(401).body("Current password is incorrect");
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("token");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            String email = request.get("email");

            // ✅ Verify the token using Firebase
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            if (email == null) {
                email = decodedToken.getEmail(); // fallback if frontend didn't send it
            }

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Email not found in Google account"));
            }

            // ✅ Check if the user already exists
            User user = userService.getUserByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setPassword("GOOGLE_USER");
                user.setRole("CUSTOMER");
                userService.saveUser(user);
            }

            // ✅ Generate JWT
            Map<String, String> tokenData = generateJwt.generateToken(user);
            String jwt = tokenData.get("token");

            // ✅ Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("jwt", jwt);
            response.put("user", user);
            response.put("message", "Google login successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Google login failed: " + e.getMessage()));
        }
    }

    // Optionally, you could add more functionality like forgot password (send a
    // reset link) if required

    @GetMapping("/check-user")
public ResponseEntity<?> checkUser(@RequestParam String email) {
    try {
        User user = userService.findByEmail(email);
        if (user == null) {
            user = userService.getUserByEmailFromDB(email);
        }

        if (user == null) {
            return ResponseEntity.ok(Map.of(
                "exists", false,
                "isGoogleUser", false
            ));
        }

        boolean isGoogleUser = "GOOGLE_USER".equals(user.getPassword());

        return ResponseEntity.ok(Map.of(
            "exists", true,
            "isGoogleUser", isGoogleUser
        ));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to check user: " + e.getMessage()));
    }
}

}
