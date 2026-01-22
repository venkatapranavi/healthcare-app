package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.dto.AdminDashboard;
import com.MyApp.DoctorConsultantApp.dto.ApprovalStatus;
import com.MyApp.DoctorConsultantApp.dto.Role;
import com.MyApp.DoctorConsultantApp.model.Appointment;
import com.MyApp.DoctorConsultantApp.model.Doctor;
import com.MyApp.DoctorConsultantApp.repository.AppointmentRepository;
import com.MyApp.DoctorConsultantApp.repository.DoctorRepository;
import com.MyApp.DoctorConsultantApp.repository.PaymentRepository;
import com.MyApp.DoctorConsultantApp.repository.UserRepository;
import com.MyApp.DoctorConsultantApp.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/appointments")
    public List<Appointment> allAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/ping")
    public String ping() {
        return "Admin Access Working";
    }

    @PutMapping("/approve-doctor/{id}")
    public ResponseEntity<String> approveDoctor(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus(ApprovalStatus.APPROVED);
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor approved successfully");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Doctor>> getPendingDoctors() {
        List<Doctor> pendingDoctors = doctorRepository.findByStatus(ApprovalStatus.PENDING);
        return ResponseEntity.ok(pendingDoctors);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboard> dashboard() {
        AdminDashboard dto = new AdminDashboard();

        dto.setTotalDoctors(doctorRepository.count());
        dto.setPendingDoctors(doctorRepository.countByStatus(ApprovalStatus.PENDING));
        dto.setTotalPatients(userRepository.countByRole(Role.USER));
        dto.setTotalAppointments(appointmentRepository.count());

        // Add payment stats
        dto.setTotalPayments(paymentRepository.count());
        Double totalAmount = paymentRepository.sumTotalAmount();
        dto.setTotalAmountCollected(totalAmount != null ? totalAmount : 0.0);

        Map<String, Long> dailyCounts = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = appointmentRepository.countByDate(date);
            dailyCounts.put(date.toString(), count);
        }
        dto.setDailyAppointments(dailyCounts);

        return ResponseEntity.ok(dto);
    }


}
