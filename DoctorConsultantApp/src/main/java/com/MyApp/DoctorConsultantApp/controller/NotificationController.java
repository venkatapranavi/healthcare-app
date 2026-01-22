package com.MyApp.DoctorConsultantApp.controller;

import com.MyApp.DoctorConsultantApp.model.Notification;
import com.MyApp.DoctorConsultantApp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{recipientType}/{recipientId}")
    public ResponseEntity<List<Notification>> getNotifications(
            @PathVariable String recipientType,
            @PathVariable Long recipientId,
            @RequestParam(required = false) Boolean unreadOnly) {
        return ResponseEntity.ok(notificationService.getNotifications(recipientType, recipientId, unreadOnly));
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
