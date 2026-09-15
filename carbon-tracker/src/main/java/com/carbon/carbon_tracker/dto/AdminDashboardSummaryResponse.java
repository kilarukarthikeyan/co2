package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;

public class AdminDashboardSummaryResponse {
    private long totalUsers;
    private long todayActivitiesCount;
    private long totalActivitiesCount;
    private BigDecimal totalCo2e;
    private BigDecimal todayCo2e;
    private BigDecimal avgCo2ePerUser;
    private UserStatDto highestLifetimeEmitter;
    private UserStatDto highestTodayEmitter;
    private UserStatDto lowestFootprintUser;

    public AdminDashboardSummaryResponse() {}

    public AdminDashboardSummaryResponse(long totalUsers, long todayActivitiesCount, long totalActivitiesCount,
                                         BigDecimal totalCo2e, BigDecimal todayCo2e, BigDecimal avgCo2ePerUser,
                                         UserStatDto highestLifetimeEmitter, UserStatDto highestTodayEmitter,
                                         UserStatDto lowestFootprintUser) {
        this.totalUsers = totalUsers;
        this.todayActivitiesCount = todayActivitiesCount;
        this.totalActivitiesCount = totalActivitiesCount;
        this.totalCo2e = totalCo2e;
        this.todayCo2e = todayCo2e;
        this.avgCo2ePerUser = avgCo2ePerUser;
        this.highestLifetimeEmitter = highestLifetimeEmitter;
        this.highestTodayEmitter = highestTodayEmitter;
        this.lowestFootprintUser = lowestFootprintUser;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTodayActivitiesCount() {
        return todayActivitiesCount;
    }

    public void setTodayActivitiesCount(long todayActivitiesCount) {
        this.todayActivitiesCount = todayActivitiesCount;
    }

    public long getTotalActivitiesCount() {
        return totalActivitiesCount;
    }

    public void setTotalActivitiesCount(long totalActivitiesCount) {
        this.totalActivitiesCount = totalActivitiesCount;
    }

    public BigDecimal getTotalCo2e() {
        return totalCo2e;
    }

    public void setTotalCo2e(BigDecimal totalCo2e) {
        this.totalCo2e = totalCo2e;
    }

    public BigDecimal getTodayCo2e() {
        return todayCo2e;
    }

    public void setTodayCo2e(BigDecimal todayCo2e) {
        this.todayCo2e = todayCo2e;
    }

    public BigDecimal getAvgCo2ePerUser() {
        return avgCo2ePerUser;
    }

    public void setAvgCo2ePerUser(BigDecimal avgCo2ePerUser) {
        this.avgCo2ePerUser = avgCo2ePerUser;
    }

    public UserStatDto getHighestLifetimeEmitter() {
        return highestLifetimeEmitter;
    }

    public void setHighestLifetimeEmitter(UserStatDto highestLifetimeEmitter) {
        this.highestLifetimeEmitter = highestLifetimeEmitter;
    }

    public UserStatDto getHighestTodayEmitter() {
        return highestTodayEmitter;
    }

    public void setHighestTodayEmitter(UserStatDto highestTodayEmitter) {
        this.highestTodayEmitter = highestTodayEmitter;
    }

    public UserStatDto getLowestFootprintUser() {
        return lowestFootprintUser;
    }

    public void setLowestFootprintUser(UserStatDto lowestFootprintUser) {
        this.lowestFootprintUser = lowestFootprintUser;
    }
}
