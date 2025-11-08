package com.stackroute.authapp.controller;

import com.stackroute.authapp.service.GenerateJwt;
import com.stackroute.authapp.model.Message;
import com.stackroute.authapp.model.User;
import com.stackroute.authapp.repository.UserRepository;
import com.stackroute.authapp.service.EmailService;
import com.stackroute.authapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
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
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private GenerateJwt generateJwt;

    private final Map<String, LocalDateTime> otpRequestTimestamps = new HashMap<>();

    // Endpoint for signup with OTP
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.addUser(user); // Generates OTP and sends email
            otpRequestTimestamps.put(user.getEmail(), LocalDateTime.now());
            return new ResponseEntity<>("OTP sent to email for verification", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint to verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isVerified = userService.verifyOtp(email, otp); // Call method on injected instance
        if (isVerified) {
            // After OTP verification, save user to the database
            User user = userService.getUserByEmail(email); // Get the user details based on email
            userService.saveUser(user); // Save the user in the database
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP.");
        }
    }

    // Endpoint to resend OTP after 1 minute delay
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {
        LocalDateTime lastRequestTime = otpRequestTimestamps.get(email);
        LocalDateTime currentTime = LocalDateTime.now();

        if (lastRequestTime != null && lastRequestTime.plusMinutes(1).isAfter(currentTime)) {
            long secondsRemaining = lastRequestTime.plusMinutes(1).toEpochSecond(ZoneOffset.UTC) - currentTime.toEpochSecond(ZoneOffset.UTC);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Please wait " + secondsRemaining + " seconds before resending OTP.");
        }

        try {
            userService.sendOtp(email); // Send OTP through email service
            otpRequestTimestamps.put(email, currentTime); // Update last request time
            return new ResponseEntity<>("OTP resent successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error resending OTP: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // User login
    @PostMapping("/login-check")
    public ResponseEntity<?> loginCheck(@RequestBody User user) {
        User result = userService.loginCheck(user.getEmail(), user.getPassword());
        if (result != null) {
            result.setPassword(null);  // Don't return password in response
            return new ResponseEntity<>(generateJwt.generateToken(result), HttpStatus.OK);
        } else {
            Message msg = new Message("Error", "Login failed....");
            return new ResponseEntity<>(msg, HttpStatus.UNAUTHORIZED);
        }
    }

}
