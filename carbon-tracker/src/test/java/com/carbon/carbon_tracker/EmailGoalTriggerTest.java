package com.carbon.carbon_tracker;

import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.entity.Goal;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.event.ActivityLoggedEvent;
import com.carbon.carbon_tracker.event.GoalEventListener;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.GoalRepository;
import com.carbon.carbon_tracker.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EmailGoalTriggerTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private GoalEventListener goalEventListener;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Sai Teja");
        testUser.setEmail("dvsteja2@gmail.com");
        testUser.setEmailAlerts(true);
        testUser.setGoalReminders(true);
    }

    @Test
    void testGoalCompletionTrigger_DispatchesEmailAndCompletesGoal() {
        Goal goal = new Goal();
        goal.setId(10L);
        goal.setUser(testUser);
        goal.setStatus("ACTIVE");
        goal.setTargetReductionPercentage(BigDecimal.valueOf(20)); // 20% reduction from 120 baseline = target <= 96
        goal.setTargetValue(BigDecimal.valueOf(96.0));
        goal.setStartDate(LocalDate.now().minusDays(5));
        goal.setEndDate(LocalDate.now().plusDays(25));

        ActivityLog log = new ActivityLog();
        log.setUser(testUser);
        log.setCalculatedCo2e(BigDecimal.valueOf(2.0));
        log.setLogDate(LocalDate.now());

        // Mock that total emissions in period are low (e.g. 50 kg emitted vs baseline 120 -> reduction = 70 kg > required 24 kg target reduction)
        when(goalRepository.findByUserId(testUser.getId())).thenReturn(List.of(goal));
        when(activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(eq(testUser.getId()), any(), any()))
                .thenReturn(50.0);

        ActivityLoggedEvent event = new ActivityLoggedEvent(this, log);
        goalEventListener.handleActivityLoggedEvent(event);

        // Verify goal status updated to COMPLETED and save called
        assertEquals("COMPLETED", goal.getStatus());
        verify(goalRepository, times(1)).save(goal);
        // Verify emailService.sendGoalCompletedEmail was triggered
        verify(emailService, times(1)).sendGoalCompletedEmail(eq(testUser), eq(goal));
    }

    @Test
    void testGoalMilestoneTrigger_DispatchesProgressEmail() {
        Goal goal = new Goal();
        goal.setId(11L);
        goal.setUser(testUser);
        goal.setStatus("ACTIVE");
        goal.setTargetReductionPercentage(BigDecimal.valueOf(50)); // 50% reduction from 120 baseline = target <= 60 (requires 60kg reduction)
        goal.setTargetValue(BigDecimal.valueOf(60.0));
        goal.setStartDate(LocalDate.now().minusDays(5));
        goal.setEndDate(LocalDate.now().plusDays(25));

        ActivityLog log = new ActivityLog();
        log.setUser(testUser);
        log.setCalculatedCo2e(BigDecimal.valueOf(5.0));
        log.setLogDate(LocalDate.now());

        // 85 kg emitted -> reduction is 120 - 85 = 35 kg out of 60 kg = ~58% progress
        when(goalRepository.findByUserId(testUser.getId())).thenReturn(List.of(goal));
        when(activityLogRepository.sumCalculatedCo2eByUserIdAndDateRange(eq(testUser.getId()), any(), any()))
                .thenReturn(85.0);

        ActivityLoggedEvent event = new ActivityLoggedEvent(this, log);
        goalEventListener.handleActivityLoggedEvent(event);

        // Verify progress milestone email is dispatched with ~58% progress
        verify(emailService, times(1)).sendGoalProgressMilestoneEmail(eq(testUser), eq(goal), eq(58));
    }
}
