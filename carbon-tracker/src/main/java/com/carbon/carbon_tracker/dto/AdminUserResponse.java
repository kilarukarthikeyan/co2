package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;

public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private long activityCount;
    private BigDecimal totalCo2e;
    private BigDecimal todayCo2e;
    private String status;

    public AdminUserResponse() {}

    public AdminUserResponse(Long id, String name, String email, String role, long activityCount,
                             BigDecimal totalCo2e, BigDecimal todayCo2e, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.activityCount = activityCount;
        this.totalCo2e = totalCo2e;
        this.todayCo2e = todayCo2e;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getActivityCount() {
        return activityCount;
    }

    public void setActivityCount(long activityCount) {
        this.activityCount = activityCount;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
