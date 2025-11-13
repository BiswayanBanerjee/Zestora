package com.stackroute.authapp.service;

import com.stackroute.authapp.model.User;
import com.stackroute.authapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Temporary storage for OTPs and users during signup
    private final Map<String, AbstractMap.SimpleEntry<String, LocalDateTime>> otpStorage = new HashMap<>();
    private final Map<String, User> tempUserStorage = new HashMap<>();

    @Override
    public User addUser(User user) {
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Generate OTP
        String otp = generateOtp();
        otpStorage.put(user.getEmail(), new AbstractMap.SimpleEntry<>(otp, LocalDateTime.now()));

        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp);

        // Store the user temporarily until OTP verification
        tempUserStorage.put(user.getEmail(), user);

        return user;
    }

    @Override
    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStorage.put(email, new AbstractMap.SimpleEntry<>(otp, LocalDateTime.now()));
        emailService.sendOtpEmail(email, otp); // Resend OTP to the user
    }

    // Generate a 6-digit OTP
    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // Generates a 6-digit OTP
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        AbstractMap.SimpleEntry<String, LocalDateTime> otpEntry = otpStorage.get(email);
        if (otpEntry != null && otpEntry.getKey().equals(otp)) {
            // Check OTP expiration (5 minutes)
            if (Duration.between(otpEntry.getValue(), LocalDateTime.now()).toMinutes() < 5) {
                otpStorage.remove(email); // Remove OTP after successful verification
                return true;
            } else {
                otpStorage.remove(email); // OTP expired
            }
        }
        return false; // Invalid or expired OTP
    }

    @Override
    public User getUserByEmail(String email) {
        return tempUserStorage.get(email); // Retrieve user for verification
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user); // Save verified user in the database
        tempUserStorage.remove(user.getEmail()); // Remove from temporary storage after saving
    }

    @Override
    public User getUserByEmailFromDB(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User loginCheck(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    @Override
    public void truncateUsers() {
        userRepository.truncateUserTable();
    }

}
