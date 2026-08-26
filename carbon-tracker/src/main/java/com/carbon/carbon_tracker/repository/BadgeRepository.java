package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
}
