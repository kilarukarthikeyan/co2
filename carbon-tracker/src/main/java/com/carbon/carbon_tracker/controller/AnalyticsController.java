package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.AnalyticsSummaryResponse;
import com.carbon.carbon_tracker.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getSummary(auth.getName()));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Object[]>> getCategories(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(auth.getName()));
    }
}
