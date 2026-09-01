package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.PasswordChangeRequest;
import com.carbon.carbon_tracker.dto.ProfileRequest;
import com.carbon.carbon_tracker.dto.ProfileResponse;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(new ProfileResponse(
            user.getName(),
            user.getEmail(),
            user.getBio(),
            user.getProfileImage(),
            user.getSustainabilityPreferences(),
            user.getNotificationPreferences(),
            user.getEmailAlerts(),
            user.getGoalReminders(),
            user.getWeeklySummaries(),
            user.getPreferredTravelType(),
            user.getDietType()
        ));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody ProfileRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());
        if (request.getSustainabilityPreferences() != null) user.setSustainabilityPreferences(request.getSustainabilityPreferences());
        if (request.getNotificationPreferences() != null) user.setNotificationPreferences(request.getNotificationPreferences());
        if (request.getEmailAlerts() != null) user.setEmailAlerts(request.getEmailAlerts());
        if (request.getGoalReminders() != null) user.setGoalReminders(request.getGoalReminders());
        if (request.getWeeklySummaries() != null) user.setWeeklySummaries(request.getWeeklySummaries());
        if (request.getPreferredTravelType() != null) user.setPreferredTravelType(request.getPreferredTravelType());
        if (request.getDietType() != null) user.setDietType(request.getDietType());

        userRepository.save(user);

        return ResponseEntity.ok(new ProfileResponse(
            user.getName(),
            user.getEmail(),
            user.getBio(),
            user.getProfileImage(),
            user.getSustainabilityPreferences(),
            user.getNotificationPreferences(),
            user.getEmailAlerts(),
            user.getGoalReminders(),
            user.getWeeklySummaries(),
            user.getPreferredTravelType(),
            user.getDietType()
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (request.getCurrentPassword() == null || request.getNewPassword() == null || request.getConfirmNewPassword() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "All fields are required"));
        }
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Current password does not match"));
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "New password and confirmation do not match"));
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("message", "Password updated successfully"));
    }
}
