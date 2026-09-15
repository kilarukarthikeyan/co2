package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.AuthRequest;
import com.carbon.carbon_tracker.dto.AuthResponse;
import com.carbon.carbon_tracker.dto.RegisterRequest;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.UserRepository;
import com.carbon.carbon_tracker.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                          JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        // Auto-provision admin if default credentials are used and user doesn't exist yet
        if ("admin@carbontrack.com".equalsIgnoreCase(authRequest.getEmail())) {
            if (userRepository.findByEmail("admin@carbontrack.com").isEmpty()) {
                User adminUser = new User();
                adminUser.setName("Administrator");
                adminUser.setEmail("admin@carbontrack.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole("ADMIN");
                userRepository.save(adminUser);
            }
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(jwt, user.getRole()));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody AuthRequest authRequest) throws Exception {
        return createAuthenticationToken(authRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        String role = registerRequest.getRole() != null ? registerRequest.getRole().toUpperCase() : "USER";
        if(!role.equals("USER") && !role.equals("ORGANIZATION")) {
            role = "USER";
        }
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
