package com.carbon.carbon_tracker.controller;

import com.carbon.carbon_tracker.entity.Goal;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.GoalRepository;
import com.carbon.carbon_tracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
public class GoalController {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalController(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(goalRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody com.carbon.carbon_tracker.dto.GoalRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        Goal goal = new Goal();
        goal.setUser(user);
        goal.setTargetReductionPercentage(request.getTargetReductionPercentage());
        // For simplicity, baseline is set to a constant or monthly average, e.g., 120kg.
        // Target value is calculated based on target reduction percentage.
        double baseline = 120.0; 
        double targetVal = baseline * (1.0 - (request.getTargetReductionPercentage().doubleValue() / 100.0));
        goal.setTargetValue(java.math.BigDecimal.valueOf(targetVal));
        goal.setStartDate(request.getStartDate());
        goal.setEndDate(request.getEndDate());
        goal.setStatus("ACTIVE");

        return ResponseEntity.ok(goalRepository.save(goal));
    }
}
