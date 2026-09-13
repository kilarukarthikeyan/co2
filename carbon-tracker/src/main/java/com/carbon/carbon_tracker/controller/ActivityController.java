package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.ActivityRequest;
import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<ActivityLog> logActivity(@RequestBody ActivityRequest request, Authentication auth) {
        return ResponseEntity.ok(activityService.logActivity(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getActivities(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate,
            Authentication auth) {
        return ResponseEntity.ok(activityService.getUserActivities(auth.getName(), startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id, Authentication auth) {
        activityService.deleteActivity(auth.getName(), id);
        return ResponseEntity.ok().build();
    }
}
