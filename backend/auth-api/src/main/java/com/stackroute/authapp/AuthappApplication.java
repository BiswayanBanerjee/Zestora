package com.stackroute.authapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.stackroute.authapp")
public class AuthappApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthappApplication.class, args);
    }
}
