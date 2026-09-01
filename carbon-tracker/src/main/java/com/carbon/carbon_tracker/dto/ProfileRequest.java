package com.carbon.carbon_tracker.dto;

public class ProfileRequest {
    private String name;
    private String bio;
    private String profileImage;
    private String sustainabilityPreferences;
    private String notificationPreferences;
    private Boolean emailAlerts;
    private Boolean goalReminders;
    private Boolean weeklySummaries;
    private String preferredTravelType;
    private String dietType;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public String getSustainabilityPreferences() { return sustainabilityPreferences; }
    public void setSustainabilityPreferences(String sustainabilityPreferences) { this.sustainabilityPreferences = sustainabilityPreferences; }
    public String getNotificationPreferences() { return notificationPreferences; }
    public void setNotificationPreferences(String notificationPreferences) { this.notificationPreferences = notificationPreferences; }
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
}
