package com.stackroute.authapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wake")
public class WakeController {

    @GetMapping
    public ResponseEntity<String> wakeUp() {
        System.out.println("Wake-up ping received!");
        return ResponseEntity.ok("✅ Service is awake");
    }
}

