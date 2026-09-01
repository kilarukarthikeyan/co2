package com.carbon.carbon_tracker;

import com.carbon.carbon_tracker.controller.ProfileController;
import com.carbon.carbon_tracker.dto.PasswordChangeRequest;
import com.carbon.carbon_tracker.dto.ProfileRequest;
import com.carbon.carbon_tracker.dto.ProfileResponse;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProfileController profileController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(authentication.getName()).thenReturn("user@example.com");
    }

    @Test
    void testGetProfile() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setName("John Doe");
        user.setBio("Eco-friendly guy");
        user.setProfileImage("image_data");
        user.setSustainabilityPreferences("preferences_data");
        user.setNotificationPreferences("notification_settings");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<ProfileResponse> response = profileController.getProfile(authentication);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("John Doe", response.getBody().getName());
        assertEquals("user@example.com", response.getBody().getEmail());
        assertEquals("Eco-friendly guy", response.getBody().getBio());
        assertEquals("image_data", response.getBody().getProfileImage());
        assertEquals("preferences_data", response.getBody().getSustainabilityPreferences());
        assertEquals("notification_settings", response.getBody().getNotificationPreferences());
    }

    @Test
    void testUpdateProfile() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setName("John Doe");
        user.setBio("Eco-friendly guy");
        user.setProfileImage("image_data");
        user.setSustainabilityPreferences("preferences_data");
        user.setNotificationPreferences("notification_settings");

        ProfileRequest request = new ProfileRequest();
        request.setName("Jane Doe");
        request.setBio("Active recycler");
        request.setNotificationPreferences("new_notification_settings");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<ProfileResponse> response = profileController.updateProfile(request, authentication);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Jane Doe", response.getBody().getName());
        assertEquals("Active recycler", response.getBody().getBio());
        assertEquals("new_notification_settings", response.getBody().getNotificationPreferences());
        // Unchanged fields should remain as is
        assertEquals("image_data", response.getBody().getProfileImage());
    }

    @Test
    void testChangePassword_Success() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("hashed_old_password");

        PasswordChangeRequest request = new PasswordChangeRequest("old_password", "new_password", "new_password");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old_password", "hashed_old_password")).thenReturn(true);
        when(passwordEncoder.encode("new_password")).thenReturn("hashed_new_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = profileController.changePassword(request, authentication);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(java.util.Map.of("message", "Password updated successfully"), response.getBody());
        assertEquals("hashed_new_password", user.getPassword());
    }

    @Test
    void testChangePassword_IncorrectCurrentPassword() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("hashed_old_password");

        PasswordChangeRequest request = new PasswordChangeRequest("wrong_password", "new_password", "new_password");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong_password", "hashed_old_password")).thenReturn(false);

        ResponseEntity<?> response = profileController.changePassword(request, authentication);

        assertNotNull(response);
        assertEquals(400, response.getStatusCode().value());
        assertEquals(java.util.Map.of("message", "Current password does not match"), response.getBody());
        // Password should not be changed
        assertEquals("hashed_old_password", user.getPassword());
        verify(userRepository, never()).save(any(User.class));
    }
}
