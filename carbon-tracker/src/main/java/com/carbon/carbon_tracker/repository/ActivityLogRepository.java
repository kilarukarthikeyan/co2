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

    long countByLogDate(LocalDate logDate);

    long countByUserId(Long userId);

    @Query("SELECT SUM(a.calculatedCo2e) FROM ActivityLog a")
    Double sumCalculatedCo2eTotal();

    @Query("SELECT SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.logDate BETWEEN :startDate AND :endDate")
    Double sumCalculatedCo2eByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a.logDate, SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.logDate BETWEEN :startDate AND :endDate GROUP BY a.logDate ORDER BY a.logDate ASC")
    List<Object[]> sumCalculatedCo2eGroupByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a.category, SUM(a.calculatedCo2e) FROM ActivityLog a GROUP BY a.category")
    List<Object[]> sumCalculatedCo2eGroupByCategoryAllUsers();

    @Query("SELECT a.user.id, a.user.name, a.user.email, SUM(a.calculatedCo2e) FROM ActivityLog a WHERE a.logDate = :logDate GROUP BY a.user.id, a.user.name, a.user.email")
    List<Object[]> sumCalculatedCo2eGroupByUserForDate(@Param("logDate") LocalDate logDate);

    List<ActivityLog> findAllByOrderByLogDateDescIdDesc();

    void deleteByUserId(Long userId);
}
