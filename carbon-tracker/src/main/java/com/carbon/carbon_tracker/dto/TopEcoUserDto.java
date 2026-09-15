package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;

public class TopEcoUserDto {
    private Long id;
    private String name;
    private String email;
    private long activityCount;
    private BigDecimal totalCo2e;

    public TopEcoUserDto() {}

    public TopEcoUserDto(Long id, String name, String email, long activityCount, BigDecimal totalCo2e) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.activityCount = activityCount;
        this.totalCo2e = totalCo2e;
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
}
