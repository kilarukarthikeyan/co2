package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.entity.Badge;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.entity.UserBadge;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.BadgeRepository;
import com.carbon.carbon_tracker.repository.UserBadgeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BadgeService {
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final ActivityLogRepository activityLogRepository;

    public BadgeService(BadgeRepository badgeRepository, UserBadgeRepository userBadgeRepository, ActivityLogRepository activityLogRepository) {
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void checkAndAwardBadges(User user) {
        // 1. Check logging streak
        int streak = calculateLoggingStreak(user.getId());
        if (streak >= 7) {
            awardBadgeIfMissing(user, "7-Day Streak Tracker", "Logged activities for 7 consecutive days.");
        }

        // 2. Check carbon reduction badges (10/25/50 kg CO2e)
        // For simplicity in academic demo, we calculate cumulative CO2 saved as:
        // (Average user footprint * number of logged activities) - user's total footprint.
        // If this value is positive, it represents carbon savings!
        double totalEmitted = activityLogRepository.findByUserIdOrderByLogDateDesc(user.getId())
                .stream()
                .mapToDouble(log -> log.getCalculatedCo2e().doubleValue())
                .sum();
        
        long logCount = activityLogRepository.findByUserIdOrderByLogDateDesc(user.getId()).size();
        double baselineEmissionPerLog = 15.0; // hypothetical baseline average emission per log
        double totalSaved = (baselineEmissionPerLog * logCount) - totalEmitted;

        if (totalSaved >= 50.0) {
            awardBadgeIfMissing(user, "Carbon Savior (50kg)", "Saved a cumulative total of 50kg CO2e.");
        } else if (totalSaved >= 25.0) {
            awardBadgeIfMissing(user, "Eco Hero (25kg)", "Saved a cumulative total of 25kg CO2e.");
        } else if (totalSaved >= 10.0) {
            awardBadgeIfMissing(user, "Green Citizen (10kg)", "Saved a cumulative total of 10kg CO2e.");
        }
    }

    private int calculateLoggingStreak(Long userId) {
        List<LocalDate> dates = activityLogRepository.findByUserIdOrderByLogDateDesc(userId)
                .stream()
                .map(log -> log.getLogDate())
                .distinct()
                .sorted((d1, d2) -> d2.compareTo(d1))
                .toList();

        if (dates.isEmpty()) return 0;
        
        int streak = 1;
        LocalDate expected = dates.get(0).minusDays(1);
        
        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else if (dates.get(i).isBefore(expected)) {
                break; // streak broken
            }
        }
        return streak;
    }

    private void awardBadgeIfMissing(User user, String badgeName, String description) {
        List<UserBadge> earned = userBadgeRepository.findByUserId(user.getId());
        boolean alreadyEarned = earned.stream()
                .anyMatch(ub -> ub.getBadge().getName().equals(badgeName));

        if (!alreadyEarned) {
            // Find badge in DB or create it
            Badge badge = badgeRepository.findAll().stream()
                    .filter(b -> b.getName().equals(badgeName))
                    .findFirst()
                    .orElseGet(() -> {
                        Badge b = new Badge();
                        b.setName(badgeName);
                        b.setDescription(description);
                        b.setCriteriaType("SAVING");
                        b.setCriteriaValue(BigDecimal.ZERO);
                        return badgeRepository.save(b);
                    });

            UserBadge userBadge = new UserBadge();
            userBadge.setUser(user);
            userBadge.setBadge(badge);
            userBadgeRepository.save(userBadge);
        }
    }
}
