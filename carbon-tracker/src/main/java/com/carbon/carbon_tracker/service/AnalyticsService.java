package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.dto.AnalyticsSummaryResponse;
import com.carbon.carbon_tracker.dto.DailyTrendPoint;
import com.carbon.carbon_tracker.dto.PeriodAnalyticsResponse;
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

        double percentile = 100.0;
        long totalUsers = userRepository.count();
        if (totalUsers > 1) {
            List<Object[]> userSums = activityLogRepository.sumCalculatedCo2eGroupByUserAndDateRange(startOfMonth, today);
            double userEmission = monthVal != null ? monthVal : 0.0;
            int cleanerThanCount = 0;
            for (Object[] row : userSums) {
                Long uid = (Long) row[0];
                Double sum = (Double) row[1];
                if (!uid.equals(userId)) {
                    double otherEmission = sum != null ? sum : 0.0;
                    if (otherEmission > userEmission) {
                        cleanerThanCount++;
                    }
                }
            }
            percentile = (cleanerThanCount / (double) totalUsers) * 100.0;
        }

        return new AnalyticsSummaryResponse(
            todayVal != null ? BigDecimal.valueOf(todayVal) : BigDecimal.ZERO,
            weekVal != null ? BigDecimal.valueOf(weekVal) : BigDecimal.ZERO,
            monthVal != null ? BigDecimal.valueOf(monthVal) : BigDecimal.ZERO,
            prevWeekVal != null ? BigDecimal.valueOf(prevWeekVal) : BigDecimal.ZERO,
            percentile
        );
    }

    public PeriodAnalyticsResponse getPeriodAnalytics(String email, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Long userId = user.getId();
        if (startDate == null) startDate = LocalDate.now();
        if (endDate == null) endDate = startDate;
        if (startDate.isAfter(endDate)) {
            LocalDate temp = startDate;
            startDate = endDate;
            endDate = temp;
        }

        Double periodSum = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal periodTotal = periodSum != null ? BigDecimal.valueOf(periodSum) : BigDecimal.ZERO;

        long days = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal dailyAvg = days > 0 ? BigDecimal.valueOf(periodTotal.doubleValue() / days) : periodTotal;

        long logCount = activityLogRepository.findByUserIdAndDateRange(userId, startDate, endDate).size();

        List<Object[]> catBreakdown = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRangeGroupByCategory(userId, startDate, endDate);
        String topCat = "None";
        BigDecimal topCatVal = BigDecimal.ZERO;
        if (!catBreakdown.isEmpty()) {
            topCat = (String) catBreakdown.get(0)[0];
            Double firstVal = (Double) catBreakdown.get(0)[1];
            topCatVal = firstVal != null ? BigDecimal.valueOf(firstVal) : BigDecimal.ZERO;
            for (Object[] row : catBreakdown) {
                Double v = (Double) row[1];
                BigDecimal val = v != null ? BigDecimal.valueOf(v) : BigDecimal.ZERO;
                if (val.compareTo(topCatVal) > 0) {
                    topCat = (String) row[0];
                    topCatVal = val;
                }
            }
        }

        double percentile = 100.0;
        long totalUsers = userRepository.count();
        if (totalUsers > 1) {
            List<Object[]> userSums = activityLogRepository.sumCalculatedCo2eGroupByUserAndDateRange(startDate, endDate);
            double userEmission = periodTotal.doubleValue();
            int cleanerThanCount = 0;
            for (Object[] row : userSums) {
                Long uid = (Long) row[0];
                Double sum = (Double) row[1];
                if (!uid.equals(userId)) {
                    double otherEmission = sum != null ? sum : 0.0;
                    if (otherEmission > userEmission) {
                        cleanerThanCount++;
                    }
                }
            }
            percentile = (cleanerThanCount / (double) totalUsers) * 100.0;
        }

        return new PeriodAnalyticsResponse(startDate, endDate, periodTotal, dailyAvg, logCount, percentile, topCat, topCatVal);
    }

    public List<Object[]> getCategoryBreakdown(String email, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                LocalDate temp = startDate;
                startDate = endDate;
                endDate = temp;
            }
            return activityLogRepository.sumCalculatedCo2eByUserIdAndDateRangeGroupByCategory(user.getId(), startDate, endDate);
        }
        return activityLogRepository.sumCalculatedCo2eByUserIdGroupByCategory(user.getId());
    }

    public List<DailyTrendPoint> getDailyTrend(String email, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (startDate == null) startDate = LocalDate.now().minusDays(6);
        if (endDate == null) endDate = LocalDate.now();
        if (startDate.isAfter(endDate)) {
            LocalDate temp = startDate;
            startDate = endDate;
            endDate = temp;
        }

        List<Object[]> rawDaily = activityLogRepository.sumDailyCo2eByUserIdAndDateRange(user.getId(), startDate, endDate);
        java.util.Map<LocalDate, BigDecimal> dailyMap = new java.util.HashMap<>();
        for (Object[] row : rawDaily) {
            LocalDate d = (LocalDate) row[0];
            Double val = (Double) row[1];
            dailyMap.put(d, val != null ? BigDecimal.valueOf(val) : BigDecimal.ZERO);
        }

        List<DailyTrendPoint> trend = new java.util.ArrayList<>();
        LocalDate curr = startDate;
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM dd");
        while (!curr.isAfter(endDate)) {
            BigDecimal co2 = dailyMap.getOrDefault(curr, BigDecimal.ZERO);
            String label = curr.format(formatter);
            trend.add(new DailyTrendPoint(curr, label, co2));
            curr = curr.plusDays(1);
        }
        return trend;
    }

    public List<Object[]> getCategoryBreakdown(String email) {
        return getCategoryBreakdown(email, null, null);
    }

    public List<String> getRecommendations(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Object[]> topActivities = activityLogRepository.findTopEmissionActivities(user.getId(), thirtyDaysAgo);

        List<String> recommendations = new java.util.ArrayList<>();
        
        for (Object[] row : topActivities) {
            if (recommendations.size() >= 3) break;
            String activityType = (String) row[0];
            String tip = getTipForActivityType(activityType);
            if (tip != null) {
                recommendations.add(tip);
            }
        }

        if (recommendations.size() < 1) {
            recommendations.add("Consider carpooling or using public transit to decrease transport emissions.");
        }
        if (recommendations.size() < 2) {
            recommendations.add("Substitute meat meals with plant-based options once a week to save up to 100kg CO₂e annually.");
        }
        if (recommendations.size() < 3) {
            recommendations.add("Switch to energy-saving LED bulbs and unplug idle electronics to lower grid electricity usage.");
        }

        return recommendations;
    }

    private String getTipForActivityType(String type) {
        if (type == null) return null;
        switch (type) {
            case "Car":
                return "Car travel is high in your footprint. Try combining trips, carpooling, or walking for distances under 2 km.";
            case "Flight":
                return "Air travel emits significant carbon. Consider offsets or opting for train travel when feasible.";
            case "Grid":
                return "High grid electricity consumption detected. Try unplugging standby devices and using eco-modes on appliances.";
            case "Meat Meal":
                return "Dietary emissions from meat are high. Swapping even one meat dish for a plant-based meal significantly cuts footprint.";
            case "Clothing":
                return "Shopping emissions from apparel can be cut by choosing high-quality, durable garments or buying second-hand.";
            case "Electronics":
                return "Electronics have high manufacturing footprints. Extend the life of your devices by repairing rather than replacing.";
            default:
                return "Optimize your " + type.toLowerCase() + " consumption by focusing on efficient usage patterns.";
        }
    }
}
