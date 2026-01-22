package com.MyApp.DoctorConsultantApp.model;

import com.MyApp.DoctorConsultantApp.dto.ApprovalStatus;
import com.MyApp.DoctorConsultantApp.dto.Role;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private String gender;
    private String specialization;
    private String qualification;
    private String bio;
    private double fees;
    private double rating;

    @Enumerated(EnumType.STRING)
    private Role role = Role.DOCTOR;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    @ElementCollection
    private List<String> tags;

    @ElementCollection
    private List<String> schedules;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }
    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    public double getFees() {
        return fees;
    }
    public void setFees(double fees) {
        this.fees = fees;
    }

    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<String> getTags() {
        return tags;
    }
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getSchedules() {
        return schedules;
    }
    public void setSchedules(List<String> schedules) {
        this.schedules = schedules;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }

    public ApprovalStatus getStatus() {
        return status;
    }
    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ",gender='"+ gender + '\'' +
                ", specialization='" + specialization + '\'' +
                ", qualification='" + qualification + '\'' +
                ", bio='" + bio + '\'' +
                ", fees=" + fees +
                ", rating=" + rating +
                ", role=" + role +
                ", status=" + status +
                ", tags=" + tags +
                ", schedules=" + schedules +
                '}';
    }
}
