package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.dto.DoctorProfileResponse;
import com.MyApp.DoctorConsultantApp.dto.DoctorRegisterRequest;
import com.MyApp.DoctorConsultantApp.dto.LoginRequest;
import com.MyApp.DoctorConsultantApp.dto.LoginResponse;
import com.MyApp.DoctorConsultantApp.model.Doctor;
import com.MyApp.DoctorConsultantApp.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/register")
    public ResponseEntity<Doctor> register(@RequestBody DoctorRegisterRequest request) {
        return ResponseEntity.ok(doctorService.register(request));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<DoctorProfileResponse> getProfile(@PathVariable Long id) {
        Doctor doctor = doctorService.getProfile(id);
        return ResponseEntity.ok(new DoctorProfileResponse(doctor));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> search(@RequestParam String specialization) {
        return ResponseEntity.ok(doctorService.findBySpecialization(specialization));
    }
}
