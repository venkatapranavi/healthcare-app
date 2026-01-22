package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.model.Payment;
import com.MyApp.DoctorConsultantApp.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PutMapping("/pay/{appointmentId}")
    public ResponseEntity<Payment> makePayment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(paymentService.makePayment(appointmentId));
    }
}
