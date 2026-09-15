package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.*;
import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/daily-emissions")
    public ResponseEntity<List<DailyEmissionDto>> getDailyEmissions(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.getDailyEmissions(days));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownDto>> getCategoryBreakdown() {
        return ResponseEntity.ok(adminService.getCategoryBreakdown());
    }

    @GetMapping("/top-eco-users")
    public ResponseEntity<List<TopEcoUserDto>> getTopEcoUsers(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminService.getTopEcoUsers(limit));
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "highest_carbon") String sortBy) {
        return ResponseEntity.ok(adminService.getUsers(search, role, sortBy));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLog>> getActivities() {
        return ResponseEntity.ok(adminService.getAllActivities());
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        adminService.deleteActivity(id);
        return ResponseEntity.ok().build();
    }
}
