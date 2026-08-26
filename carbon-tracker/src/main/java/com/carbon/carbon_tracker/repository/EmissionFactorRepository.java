package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {
    Optional<EmissionFactor> findByCategoryAndActivityTypeAndUnit(String category, String activityType, String unit);
}
