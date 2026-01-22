package com.MyApp.DoctorConsultantApp.dto;

import com.MyApp.DoctorConsultantApp.model.Doctor;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.List;

public class DoctorProfileResponse {
    public Long id;
    public String fullName;
    public String email;
    public String gender;
    public String specialization;
    public String qualification;
    public String bio;
    public double fees;
    public double rating;
    public List<String> tags;
    public List<String> schedules;

    @Enumerated(EnumType.STRING)
    public ApprovalStatus status = ApprovalStatus.PENDING;

    public DoctorProfileResponse(Doctor doctor) {
        this.id = doctor.getId();
        this.fullName = doctor.getFullName();
        this.email = doctor.getEmail();
        this.gender = doctor.getGender();
        this.specialization = doctor.getSpecialization();
        this.qualification = doctor.getQualification();
        this.bio = doctor.getBio();
        this.fees = doctor.getFees();
        this.rating = doctor.getRating();
        this.tags = doctor.getTags();
        this.schedules = doctor.getSchedules();
        this.status = doctor.getStatus();
    }

}
