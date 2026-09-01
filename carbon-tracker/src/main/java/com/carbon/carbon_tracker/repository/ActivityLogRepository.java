package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserIdOrderByLogDateDesc(Long userId);
    
    @Query("SELECT SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.user.id = :userId AND a.logDate BETWEEN :startDate AND :endDate")
    Double sumCalculatedCo2eByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.user.organization.id = :orgId")
    Double sumCalculatedCo2eByOrgId(@Param("orgId") Long orgId);
    
    @Query("SELECT a.category, SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.user.id = :userId GROUP BY a.category")
    List<Object[]> sumCalculatedCo2eByUserIdGroupByCategory(@Param("userId") Long userId);

    @Query("SELECT a.user.id, SUM(a.calculatedCo2e) FROM ActivityLog a GROUP BY a.user.id")
    List<Object[]> sumCalculatedCo2eGroupByUser();

    @Query("SELECT a.user.id, SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.logDate BETWEEN :startDate AND :endDate GROUP BY a.user.id")
    List<Object[]> sumCalculatedCo2eGroupByUserAndDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a.activityType, SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.user.id = :userId AND a.logDate >= :since GROUP BY a.activityType ORDER BY SUM(a.calculatedCo2e) DESC")
    List<Object[]> findTopEmissionActivities(@Param("userId") Long userId, @Param("since") LocalDate since);
}
