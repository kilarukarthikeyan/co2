package com.carbon.carbon_tracker.event;

import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.entity.Goal;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.GoalRepository;
import com.carbon.carbon_tracker.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class GoalEventListener {
    private static final Logger logger = LoggerFactory.getLogger(GoalEventListener.class);

    private final GoalRepository goalRepository;
    private final ActivityLogRepository activityLogRepository;
    private final EmailService emailService;

    public GoalEventListener(GoalRepository goalRepository, 
                             ActivityLogRepository activityLogRepository, 
                             EmailService emailService) {
        this.goalRepository = goalRepository;
        this.activityLogRepository = activityLogRepository;
        this.emailService = emailService;
    }

    @EventListener
    public void handleActivityLoggedEvent(ActivityLoggedEvent event) {
        ActivityLog log = event.getActivityLog();
        User user = log.getUser();
        if (user == null) return;

        List<Goal> activeGoals = goalRepository.findByUserId(user.getId())
                .stream()
                .filter(g -> "ACTIVE".equalsIgnoreCase(g.getStatus()))
                .toList();

        for (Goal goal : activeGoals) {
            evaluateGoalProgress(user, goal);
        }
    }

    private void evaluateGoalProgress(User user, Goal goal) {
        LocalDate start = goal.getStartDate() != null ? goal.getStartDate() : LocalDate.now().withDayOfMonth(1);
        LocalDate end = goal.getEndDate() != null ? goal.getEndDate() : LocalDate.now();

        Double actualEmissionsVal = activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(user.getId(), start, end);
        double actualEmissions = actualEmissionsVal != null ? actualEmissionsVal : 0.0;

        double baseline = 120.0; // Standard baseline reference
        double targetVal = goal.getTargetValue() != null ? goal.getTargetValue().doubleValue() : (baseline * 0.8);
        double targetReduction = Math.max(1.0, baseline - targetVal);

        // Progress toward keeping emissions under target reduction
        double currentReduction = Math.max(0.0, baseline - actualEmissions);
        int progressPercentage = (int) Math.min(100.0, Math.max(0.0, (currentReduction / targetReduction) * 100.0));

        logger.info("Evaluating Goal #{} for user {}: Progress = {}%", goal.getId(), user.getEmail(), progressPercentage);

        if (progressPercentage >= 100) {
            goal.setStatus("COMPLETED");
            goalRepository.save(goal);
            logger.info("Goal #{} completed for user {}", goal.getId(), user.getEmail());
            emailService.sendGoalCompletedEmail(user, goal);
        } else if (progressPercentage >= 50) {
            emailService.sendGoalProgressMilestoneEmail(user, goal, progressPercentage);
        }
    }
}
