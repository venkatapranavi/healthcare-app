package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.dto.*;
import com.MyApp.DoctorConsultantApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(new UserProfileResponse(userService.getProfile(id)));
    }

    @PutMapping("/profile/update/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable Long id, @RequestBody UpdateUserProfileRequest request) {
        userService.updateUserProfile(id, request);
        return ResponseEntity.ok("Profile updated successfully.");
    }

    @PutMapping("/change-password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        userService.changeUserPassword(id, request);
        return ResponseEntity.ok("Password changed successfully.");
    }
}
