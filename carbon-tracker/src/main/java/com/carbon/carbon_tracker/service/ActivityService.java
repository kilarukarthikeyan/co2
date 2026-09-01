package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.dto.ActivityRequest;
import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.entity.EmissionFactor;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.ActivityLogRepository;
import com.carbon.carbon_tracker.repository.EmissionFactorRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import com.carbon.carbon_tracker.event.ActivityLoggedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ActivityService {
    private final ActivityLogRepository activityLogRepository;
    private final EmissionFactorRepository emissionFactorRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ActivityService(ActivityLogRepository activityLogRepository, EmissionFactorRepository emissionFactorRepository, UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.activityLogRepository = activityLogRepository;
        this.emissionFactorRepository = emissionFactorRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    public ActivityLog logActivity(String email, ActivityRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        EmissionFactor factor = emissionFactorRepository.findByCategoryAndActivityTypeAndUnit(
                request.getCategory(), request.getActivityType(), request.getUnit()
        ).orElseThrow(() -> new RuntimeException("Emission factor not found"));

        BigDecimal calculatedCo2e = request.getQuantity().multiply(factor.getFactorValue());

        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setCategory(request.getCategory());
        log.setActivityType(request.getActivityType());
        log.setQuantity(request.getQuantity());
        log.setUnit(request.getUnit());
        log.setLogDate(request.getLogDate());
        log.setCalculatedCo2e(calculatedCo2e);
        log.setMemo(request.getMemo());

        ActivityLog saved = activityLogRepository.save(log);
        eventPublisher.publishEvent(new ActivityLoggedEvent(this, saved));
        return saved;
    }

    public List<ActivityLog> getUserActivities(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return activityLogRepository.findByUserIdOrderByLogDateDesc(user.getId());
    }

    public void deleteActivity(String email, Long id) {
        ActivityLog log = activityLogRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Activity not found"));

        if (!log.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to delete this activity");
        }

        activityLogRepository.deleteById(id);
    }
}
