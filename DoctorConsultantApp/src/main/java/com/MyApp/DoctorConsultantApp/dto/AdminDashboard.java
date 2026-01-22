package com.MyApp.DoctorConsultantApp.dto;

import java.util.Map;

public class AdminDashboard {

    private long totalDoctors;
    private long pendingDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long totalPayments;
    private double totalAmountCollected;
    private Map<String, Long> dailyAppointments;

    public long getTotalDoctors() {
        return totalDoctors;
    }
    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getPendingDoctors() {
        return pendingDoctors;
    }
    public void setPendingDoctors(long pendingDoctors) {
        this.pendingDoctors = pendingDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }
    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }
    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalPayments() {
        return totalPayments;
    }
    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public double getTotalAmountCollected() {
        return totalAmountCollected;
    }
    public void setTotalAmountCollected(double totalAmountCollected) {
        this.totalAmountCollected = totalAmountCollected;
    }

    public Map<String, Long> getDailyAppointments() {
        return dailyAppointments;
    }
    public void setDailyAppointments(Map<String, Long> dailyAppointments) {
        this.dailyAppointments = dailyAppointments;
    }

    @Override
    public String toString() {
        return "AdminDashboard{" +
                "totalDoctors=" + totalDoctors +
                ", pendingDoctors=" + pendingDoctors +
                ", totalPatients=" + totalPatients +
                ", totalAppointments=" + totalAppointments +
                ", totalPayments=" + totalPayments +
                ", totalAmountCollected=" + totalAmountCollected +
                ", dailyAppointments=" + dailyAppointments +
                '}';
    }
}
