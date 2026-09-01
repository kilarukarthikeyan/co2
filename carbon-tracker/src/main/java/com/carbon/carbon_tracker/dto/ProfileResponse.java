package com.carbon.carbon_tracker.dto;

public class ProfileResponse {
    private String name;
    private String email;
    private String bio;
    private String profileImage;
    private String sustainabilityPreferences;
    private String notificationPreferences;
    private Boolean emailAlerts;
    private Boolean goalReminders;
    private Boolean weeklySummaries;
    private String preferredTravelType;
    private String dietType;

    public ProfileResponse(String name, String email, String bio, String profileImage, 
                           String sustainabilityPreferences, String notificationPreferences,
                           Boolean emailAlerts, Boolean goalReminders, Boolean weeklySummaries,
                           String preferredTravelType, String dietType) {
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.profileImage = profileImage;
        this.sustainabilityPreferences = sustainabilityPreferences;
        this.notificationPreferences = notificationPreferences;
        this.emailAlerts = emailAlerts;
        this.goalReminders = goalReminders;
        this.weeklySummaries = weeklySummaries;
        this.preferredTravelType = preferredTravelType;
        this.dietType = dietType;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getBio() { return bio; }
    public String getProfileImage() { return profileImage; }
    public String getSustainabilityPreferences() { return sustainabilityPreferences; }
    public String getNotificationPreferences() { return notificationPreferences; }
    public Boolean getEmailAlerts() { return emailAlerts; }
    public String getPreferredTravelType() { return preferredTravelType; }
    public String getDietType() { return dietType; }
    public Boolean getGoalReminders() { return goalReminders; }
    public Boolean getWeeklySummaries() { return weeklySummaries; }
}
