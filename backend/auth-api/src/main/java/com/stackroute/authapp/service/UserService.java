package com.stackroute.authapp.service;

import com.stackroute.authapp.model.User;

public interface UserService {
    User addUser(User user);
    boolean verifyOtp(String email, String otp);
    User getUserByEmail(String email);
    void saveUser(User user);
    void sendOtp(String email); // Add this method for OTP resend
    User loginCheck(String email, String password);
    User findByEmail(String email);
    User getUserByEmailFromDB(String email);
    void truncateUsers();
}
