package com.stackroute.authapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.stackroute.authapp.service.UserService;

@RestController
@RequestMapping("/admin/db")
public class TruncateController {

    @Autowired
    private UserService userService;

    @PostMapping("/truncate-users")
    public ResponseEntity<String> truncateUsers() {
        userService.truncateUsers();
        return ResponseEntity.ok("User table truncated successfully!");
    }
}
