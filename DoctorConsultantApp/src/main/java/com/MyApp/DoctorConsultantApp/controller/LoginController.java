package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.dto.LoginRequest;
import com.MyApp.DoctorConsultantApp.dto.LoginResponse;
import com.MyApp.DoctorConsultantApp.dto.Role;
import com.MyApp.DoctorConsultantApp.model.User;
import com.MyApp.DoctorConsultantApp.repository.DoctorRepository;
import com.MyApp.DoctorConsultantApp.repository.UserRepository;
import com.MyApp.DoctorConsultantApp.service.UserService;
import com.MyApp.DoctorConsultantApp.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // First check userRepository (for USER and ADMIN)
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Incorrect password");
            }

            Role role = user.getRole();
            LoginResponse response = switch (role) {
                case USER -> userService.login(request);
                case ADMIN -> new LoginResponse(user.getId(), user.getFullName(), user.getEmail(), "ADMIN", "N/A");
                default -> throw new RuntimeException("Invalid role in user table");
            };

            return ResponseEntity.ok(response);
        }

        // Then check doctorRepository
        var doctorOpt = doctorRepository.findByEmail(request.getEmail());
        if (doctorOpt.isPresent()) {
            return ResponseEntity.ok(doctorService.doctorLogin(request));
        }

        throw new RuntimeException("User or doctor not found with given email");
    }
}
