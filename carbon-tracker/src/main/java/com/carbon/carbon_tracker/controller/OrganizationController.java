package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.OrgEmployeeEmission;
import com.carbon.carbon_tracker.dto.OrgStatsResponse;
import com.carbon.carbon_tracker.dto.EmployeeCreateRequest;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.entity.Organization;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import com.carbon.carbon_tracker.repository.OrganizationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organization")
public class OrganizationController {
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public OrganizationController(UserRepository userRepository, ActivityLogRepository activityLogRepository,
                                  OrganizationRepository organizationRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/stats")
    public ResponseEntity<OrgStatsResponse> getOrgStats(Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            return ResponseEntity.ok(new OrgStatsResponse(0, 0.0, 0.0));
        }

        List<User> employees = userRepository.findByOrganizationId(org.getId());
        long employeeCount = employees.size();

        double totalCo2 = 0.0;
        for (User emp : employees) {
            Double userCo2 = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(emp.getId(), java.time.LocalDate.now().withDayOfMonth(1), java.time.LocalDate.now());
            if (userCo2 != null) {
                totalCo2 += userCo2;
            }
        }

        double avgDaily = employeeCount > 0 ? (totalCo2 / employeeCount / 30.0) : 0.0;
        double saved = org.getSustainabilityTarget() != null ? Math.max(0.0, (org.getSustainabilityTarget() - totalCo2) / 1000.0) : 0.0; // saved in tons

        return ResponseEntity.ok(new OrgStatsResponse(
            employeeCount,
            Math.round(avgDaily * 10.0) / 10.0,
            Math.round(saved * 10.0) / 10.0
        ));
    }

    @GetMapping("/department-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentBreakdown(Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<User> employees = userRepository.findByOrganizationId(org.getId());
        Map<String, Map<String, Double>> depts = new HashMap<>(); // Department -> (Category -> Sum)

        for (User emp : employees) {
            String dept = emp.getDepartment() != null && !emp.getDepartment().trim().isEmpty() ? emp.getDepartment() : "General";
            List<com.carbon.carbon_tracker.entity.ActivityLog> logs = activityLogRepository.findByUserIdOrderByLogDateDesc(emp.getId());
            for (com.carbon.carbon_tracker.entity.ActivityLog log : logs) {
                depts.putIfAbsent(dept, new HashMap<>());
                Map<String, Double> cats = depts.get(dept);
                String cat = log.getCategory().toLowerCase(); // e.g. "transport", "electricity"
                cats.put(cat, cats.getOrDefault(cat, 0.0) + log.getCalculatedCo2e().doubleValue());
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Map<String, Double>> entry : depts.entrySet()) {
            Map<String, Object> row = new HashMap<>();
            row.put("department", entry.getKey());
            row.put("transport", Math.round(entry.getValue().getOrDefault("transport", 0.0)));
            row.put("electricity", Math.round(entry.getValue().getOrDefault("electricity", 0.0)));
            row.put("food", Math.round(entry.getValue().getOrDefault("food", 0.0)));
            row.put("shopping", Math.round(entry.getValue().getOrDefault("shopping", 0.0)));
            response.add(row);
        }

        // Add a fallback default row if empty so the chart renders nicely
        if (response.isEmpty()) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("department", "Engineering");
            fallback.put("transport", 0);
            fallback.put("electricity", 0);
            fallback.put("food", 0);
            fallback.put("shopping", 0);
            response.add(fallback);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<OrgEmployeeEmission>> getEmployeeComparison(Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<OrgEmployeeEmission> list = new ArrayList<>();
        List<User> employees = userRepository.findByOrganizationId(org.getId());
        for (User emp : employees) {
            double emitted = activityLogRepository.findByUserIdOrderByLogDateDesc(emp.getId())
                    .stream()
                    .mapToDouble(log -> log.getCalculatedCo2e().doubleValue())
                    .sum();
            int logCount = activityLogRepository.findByUserIdOrderByLogDateDesc(emp.getId()).size();
            list.add(new OrgEmployeeEmission(emp.getName(), emp.getEmail(), Math.round(emitted * 100.0) / 100.0, logCount));
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/employees")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeCreateRequest request, Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            return ResponseEntity.badRequest().body("Organization settings must be saved first to configure the organization.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User employee = new User();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole("USER"); // standard employee role
        employee.setOrganization(org);
        employee.setDepartment(request.getDepartment());

        userRepository.save(employee);
        return ResponseEntity.ok("Employee added successfully!");
    }

    @GetMapping("/settings")
    public ResponseEntity<Organization> getSettings(Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            org = new Organization();
            org.setName("Eco Corp");
            org.setDescription("Main Eco Organization");
            org.setJoinToken("ECO-1234");
            org.setSustainabilityTarget(1500.0);
            org = organizationRepository.save(org);
            orgUser.setOrganization(org);
            userRepository.save(orgUser);
        }
        return ResponseEntity.ok(org);
    }

    @PutMapping("/settings")
    public ResponseEntity<Organization> updateSettings(@RequestBody Organization request, Authentication auth) {
        User orgUser = userRepository.findByEmail(auth.getName()).orElseThrow();
        Organization org = orgUser.getOrganization();
        if (org == null) {
            org = new Organization();
            orgUser.setOrganization(org);
        }
        if (request.getName() != null) org.setName(request.getName());
        if (request.getDescription() != null) org.setDescription(request.getDescription());
        if (request.getJoinToken() != null) org.setJoinToken(request.getJoinToken());
        if (request.getSustainabilityTarget() != null) org.setSustainabilityTarget(request.getSustainabilityTarget());
        
        Organization saved = organizationRepository.save(org);
        orgUser.setOrganization(saved);
        userRepository.save(orgUser);
        return ResponseEntity.ok(saved);
    }
}
