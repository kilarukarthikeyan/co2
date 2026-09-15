package com.carbon.carbon_tracker.service;

import com.carbon.carbon_tracker.dto.*;
import com.carbon.carbon_tracker.entity.ActivityLog;
import com.carbon.carbon_tracker.entity.User;
import com.carbon.carbon_tracker.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final GoalRepository goalRepository;
    private final UserBadgeRepository userBadgeRepository;

    public AdminService(UserRepository userRepository,
                        ActivityLogRepository activityLogRepository,
                        GoalRepository goalRepository,
                        UserBadgeRepository userBadgeRepository) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.goalRepository = goalRepository;
        this.userBadgeRepository = userBadgeRepository;
    }

    public AdminDashboardSummaryResponse getDashboardSummary() {
        LocalDate today = LocalDate.now();

        long totalUsers = userRepository.count();
        long todayActivitiesCount = activityLogRepository.countByLogDate(today);
        long totalActivitiesCount = activityLogRepository.count();

        Double totalCo2eVal = activityLogRepository.sumCalculatedCo2eTotal();
        BigDecimal totalCo2e = totalCo2eVal != null ? BigDecimal.valueOf(totalCo2eVal).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        Double todayCo2eVal = activityLogRepository.sumCalculatedCo2eByDateRange(today, today);
        BigDecimal todayCo2e = todayCo2eVal != null ? BigDecimal.valueOf(todayCo2eVal).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        BigDecimal avgCo2ePerUser = totalUsers > 0
                ? totalCo2e.divide(BigDecimal.valueOf(totalUsers), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // User totals for lifetime emitter and lowest footprint
        List<User> allUsers = userRepository.findAll();
        Map<Long, BigDecimal> userLifetimeTotals = new HashMap<>();
        for (Object[] row : activityLogRepository.sumCalculatedCo2eGroupByUser()) {
            if (row[0] != null && row[1] != null) {
                userLifetimeTotals.put((Long) row[0], ((BigDecimal) row[1]).setScale(2, RoundingMode.HALF_UP));
            }
        }

        UserStatDto highestLifetimeEmitter = null;
        UserStatDto lowestFootprintUser = null;

        if (!allUsers.isEmpty()) {
            User highestUser = allUsers.stream()
                    .max(Comparator.comparing(u -> userLifetimeTotals.getOrDefault(u.getId(), BigDecimal.ZERO)))
                    .orElse(null);

            if (highestUser != null) {
                highestLifetimeEmitter = new UserStatDto(
                        highestUser.getName(),
                        highestUser.getEmail(),
                        userLifetimeTotals.getOrDefault(highestUser.getId(), BigDecimal.ZERO)
                );
            }

            User lowestUser = allUsers.stream()
                    .min(Comparator.comparing(u -> userLifetimeTotals.getOrDefault(u.getId(), BigDecimal.ZERO)))
                    .orElse(null);

            if (lowestUser != null) {
                lowestFootprintUser = new UserStatDto(
                        lowestUser.getName(),
                        lowestUser.getEmail(),
                        userLifetimeTotals.getOrDefault(lowestUser.getId(), BigDecimal.ZERO)
                );
            }
        }

        // Highest today emitter
        UserStatDto highestTodayEmitter = null;
        List<Object[]> todayUserSums = activityLogRepository.sumCalculatedCo2eGroupByUserForDate(today);
        if (!todayUserSums.isEmpty()) {
            todayUserSums.sort((a, b) -> ((BigDecimal) b[3]).compareTo((BigDecimal) a[3]));
            Object[] topToday = todayUserSums.get(0);
            highestTodayEmitter = new UserStatDto(
                    (String) topToday[1],
                    (String) topToday[2],
                    ((BigDecimal) topToday[3]).setScale(2, RoundingMode.HALF_UP)
            );
        } else if (highestLifetimeEmitter != null) {
            highestTodayEmitter = new UserStatDto(highestLifetimeEmitter.getName(), highestLifetimeEmitter.getEmail(), BigDecimal.ZERO);
        }

        return new AdminDashboardSummaryResponse(
                totalUsers,
                todayActivitiesCount,
                totalActivitiesCount,
                totalCo2e,
                todayCo2e,
                avgCo2ePerUser,
                highestLifetimeEmitter,
                highestTodayEmitter,
                lowestFootprintUser
        );
    }

    public List<DailyEmissionDto> getDailyEmissions(int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days > 0 ? days - 1 : 29);

        List<Object[]> rows = activityLogRepository.sumCalculatedCo2eGroupByDateRange(startDate, today);
        Map<LocalDate, BigDecimal> dateMap = new HashMap<>();
        for (Object[] r : rows) {
            LocalDate d = (LocalDate) r[0];
            BigDecimal val = (BigDecimal) r[1];
            dateMap.put(d, val != null ? val.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        }

        List<DailyEmissionDto> result = new ArrayList<>();
        LocalDate cur = startDate;
        while (!cur.isAfter(today)) {
            BigDecimal co2e = dateMap.getOrDefault(cur, BigDecimal.ZERO);
            result.add(new DailyEmissionDto(cur, co2e));
            cur = cur.plusDays(1);
        }
        return result;
    }

    public List<CategoryBreakdownDto> getCategoryBreakdown() {
        List<Object[]> rows = activityLogRepository.sumCalculatedCo2eGroupByCategoryAllUsers();
        Double totalVal = activityLogRepository.sumCalculatedCo2eTotal();
        double total = totalVal != null && totalVal > 0 ? totalVal : 1.0;

        List<CategoryBreakdownDto> list = new ArrayList<>();
        for (Object[] r : rows) {
            String cat = (String) r[0];
            BigDecimal val = r[1] != null ? (BigDecimal) r[1] : BigDecimal.ZERO;
            double pct = (val.doubleValue() / total) * 100.0;
            list.add(new CategoryBreakdownDto(cat, val.setScale(2, RoundingMode.HALF_UP), Math.round(pct * 10.0) / 10.0));
        }
        list.sort((a, b) -> b.getTotalCo2e().compareTo(a.getTotalCo2e()));
        return list;
    }

    public List<TopEcoUserDto> getTopEcoUsers(int limit) {
        Map<Long, BigDecimal> userLifetimeTotals = new HashMap<>();
        for (Object[] row : activityLogRepository.sumCalculatedCo2eGroupByUser()) {
            if (row[0] != null && row[1] != null) {
                userLifetimeTotals.put((Long) row[0], ((BigDecimal) row[1]).setScale(2, RoundingMode.HALF_UP));
            }
        }

        List<User> users = userRepository.findAll();
        List<TopEcoUserDto> result = new ArrayList<>();
        for (User u : users) {
            long count = activityLogRepository.countByUserId(u.getId());
            BigDecimal total = userLifetimeTotals.getOrDefault(u.getId(), BigDecimal.ZERO);
            result.add(new TopEcoUserDto(u.getId(), u.getName(), u.getEmail(), count, total));
        }

        result.sort(Comparator.comparing(TopEcoUserDto::getTotalCo2e));
        if (limit > 0 && result.size() > limit) {
            return result.subList(0, limit);
        }
        return result;
    }

    public List<AdminUserResponse> getUsers(String search, String role, String sortBy) {
        LocalDate today = LocalDate.now();

        Map<Long, BigDecimal> userLifetimeTotals = new HashMap<>();
        for (Object[] row : activityLogRepository.sumCalculatedCo2eGroupByUser()) {
            if (row[0] != null && row[1] != null) {
                userLifetimeTotals.put((Long) row[0], ((BigDecimal) row[1]).setScale(2, RoundingMode.HALF_UP));
            }
        }

        Map<Long, BigDecimal> userTodayTotals = new HashMap<>();
        for (Object[] row : activityLogRepository.sumCalculatedCo2eGroupByUserForDate(today)) {
            if (row[0] != null && row[3] != null) {
                userTodayTotals.put((Long) row[0], ((BigDecimal) row[3]).setScale(2, RoundingMode.HALF_UP));
            }
        }

        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(u -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.trim().toLowerCase();
                        boolean matchName = u.getName() != null && u.getName().toLowerCase().contains(s);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(s);
                        if (!matchName && !matchEmail) return false;
                    }
                    if (role != null && !role.trim().isEmpty() && !role.equalsIgnoreCase("ALL")) {
                        if (!u.getRole().equalsIgnoreCase(role.trim())) return false;
                    }
                    return true;
                })
                .map(u -> {
                    long count = activityLogRepository.countByUserId(u.getId());
                    BigDecimal total = userLifetimeTotals.getOrDefault(u.getId(), BigDecimal.ZERO);
                    BigDecimal todaySum = userTodayTotals.getOrDefault(u.getId(), BigDecimal.ZERO);
                    return new AdminUserResponse(
                            u.getId(),
                            u.getName(),
                            u.getEmail(),
                            u.getRole(),
                            count,
                            total,
                            todaySum,
                            "ACTIVE"
                    );
                })
                .sorted((a, b) -> {
                    if ("highest_carbon".equalsIgnoreCase(sortBy)) {
                        return b.getTotalCo2e().compareTo(a.getTotalCo2e());
                    } else if ("lowest_carbon".equalsIgnoreCase(sortBy)) {
                        return a.getTotalCo2e().compareTo(b.getTotalCo2e());
                    } else if ("most_activities".equalsIgnoreCase(sortBy)) {
                        return Long.compare(b.getActivityCount(), a.getActivityCount());
                    } else {
                        return a.getName().compareToIgnoreCase(b.getName());
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        activityLogRepository.deleteByUserId(userId);
        goalRepository.deleteByUserId(userId);
        userBadgeRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    public List<ActivityLog> getAllActivities() {
        return activityLogRepository.findAllByOrderByLogDateDescIdDesc();
    }

    public void deleteActivity(Long id) {
        activityLogRepository.deleteById(id);
    }
}
