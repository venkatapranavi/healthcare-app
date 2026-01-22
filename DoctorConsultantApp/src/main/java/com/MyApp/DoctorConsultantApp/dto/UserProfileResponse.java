package com.MyApp.DoctorConsultantApp.dto;

import com.MyApp.DoctorConsultantApp.model.User;

import java.util.List;

public class UserProfileResponse {
    public Long id;
    public String fullName;
    public String email;
    public String phone;
    public String gender;
    public int age;
    public double height;
    public double weight;
    public String bloodGroup;
    public boolean premium;
    public String aboutMe;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.gender = user.getGender();
        this.age = user.getAge();
        this.height = user.getHeight();
        this.weight = user.getWeight();
        this.bloodGroup = user.getBloodGroup();
        this.premium = user.isPremium();
        this.aboutMe = user.getAboutMe();
    }
}
