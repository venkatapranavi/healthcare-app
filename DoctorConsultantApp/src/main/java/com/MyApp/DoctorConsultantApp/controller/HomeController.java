package com.MyApp.DoctorConsultantApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @GetMapping("/user/{id}")
    public ResponseEntity<String> userHome(@PathVariable Long id) {
        return ResponseEntity.ok("Welcome to your dashboard, User ID: " + id);
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<String> doctorHome(@PathVariable Long id) {
        return ResponseEntity.ok("Welcome to your dashboard, Doctor ID: " + id);
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminHome() {
        return ResponseEntity.ok("Welcome to your dashboard, Admin");
    }
}
