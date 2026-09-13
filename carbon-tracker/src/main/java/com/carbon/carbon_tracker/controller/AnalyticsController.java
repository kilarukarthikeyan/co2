package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.dto.AnalyticsSummaryResponse;
import com.carbon.carbon_tracker.dto.DailyTrendPoint;
import com.carbon.carbon_tracker.dto.PeriodAnalyticsResponse;
import com.carbon.carbon_tracker.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
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

    @GetMapping("/period-summary")
    public ResponseEntity<PeriodAnalyticsResponse> getPeriodSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        return ResponseEntity.ok(analyticsService.getPeriodAnalytics(auth.getName(), startDate, endDate));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Object[]>> getCategories(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(auth.getName(), startDate, endDate));
    }

    @GetMapping("/trend")
    public ResponseEntity<List<DailyTrendPoint>> getTrend(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        return ResponseEntity.ok(analyticsService.getDailyTrend(auth.getName(), startDate, endDate));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<String>> getRecommendations(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getRecommendations(auth.getName()));
    }
}
