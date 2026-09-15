package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
