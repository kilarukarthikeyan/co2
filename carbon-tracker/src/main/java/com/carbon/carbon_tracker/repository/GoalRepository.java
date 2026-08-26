package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    Optional<Goal> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    List<Goal> findByUserId(Long userId);
}
