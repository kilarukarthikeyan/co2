package com.carbon.carbon_tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String role;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;
    
    @Column(name = "sustainability_preferences")
    private String sustainabilityPreferences;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGTEXT")
    private String profileImage;

    @Column(name = "notification_preferences", columnDefinition = "TEXT")
    private String notificationPreferences;
    
    @Column(name = "email_alerts")
    private Boolean emailAlerts = true;

    @Column(name = "goal_reminders")
    private Boolean goalReminders = true;

    @Column(name = "weekly_summaries")
    private Boolean weeklySummaries = true;

    @Column(name = "preferred_travel_type")
    private String preferredTravelType = "Car";

    @Column(name = "diet_type")
    private String dietType = "Vegetarian";

    private String department;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public String getSustainabilityPreferences() { return sustainabilityPreferences; }
    public void setSustainabilityPreferences(String sustainabilityPreferences) { this.sustainabilityPreferences = sustainabilityPreferences; }
    public String getNotificationPreferences() { return notificationPreferences; }
    public void setNotificationPreferences(String notificationPreferences) { this.notificationPreferences = notificationPreferences; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public Boolean getEmailAlerts() { return emailAlerts; }
    public void setEmailAlerts(Boolean emailAlerts) { this.emailAlerts = emailAlerts; }
    public Boolean getGoalReminders() { return goalReminders; }
    public void setGoalReminders(Boolean goalReminders) { this.goalReminders = goalReminders; }
    public Boolean getWeeklySummaries() { return weeklySummaries; }
    public void setWeeklySummaries(Boolean weeklySummaries) { this.weeklySummaries = weeklySummaries; }
    public String getPreferredTravelType() { return preferredTravelType; }
    public void setPreferredTravelType(String preferredTravelType) { this.preferredTravelType = preferredTravelType; }
    public String getDietType() { return dietType; }
    public void setDietType(String dietType) { this.dietType = dietType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
