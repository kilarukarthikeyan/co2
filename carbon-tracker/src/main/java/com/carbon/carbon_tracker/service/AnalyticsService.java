package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.dto.AnalyticsSummaryResponse;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.List;

@Service
public class AnalyticsService {
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public AnalyticsService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    public AnalyticsSummaryResponse getSummary(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Long userId = user.getId();
        LocalDate today = LocalDate.now();
        
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate startOfMonth = today.withDayOfMonth(1);
        
        LocalDate startOfPrevWeek = startOfWeek.minusWeeks(1);
        LocalDate endOfPrevWeek = startOfWeek.minusDays(1);

        Double todayVal = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(userId, today, today);
        Double weekVal = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(userId, startOfWeek, today);
        Double monthVal = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(userId, startOfMonth, today);
        Double prevWeekVal = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(userId, startOfPrevWeek, endOfPrevWeek);

        return new AnalyticsSummaryResponse(
            todayVal != null ? BigDecimal.valueOf(todayVal) : BigDecimal.ZERO,
            weekVal != null ? BigDecimal.valueOf(weekVal) : BigDecimal.ZERO,
            monthVal != null ? BigDecimal.valueOf(monthVal) : BigDecimal.ZERO,
            prevWeekVal != null ? BigDecimal.valueOf(prevWeekVal) : BigDecimal.ZERO
        );
    }

    public List<Object[]> getCategoryBreakdown(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return activityLogRepository.sumCalculatedCo2eByUserIdGroupByCategory(user.getId());
    }
}
