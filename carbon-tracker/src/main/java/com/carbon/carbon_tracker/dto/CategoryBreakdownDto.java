package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;

public class CategoryBreakdownDto {
    private String category;
    private BigDecimal totalCo2e;
    private double percentage;

    public CategoryBreakdownDto() {}

    public CategoryBreakdownDto(String category, BigDecimal totalCo2e, double percentage) {
        this.category = category;
        this.totalCo2e = totalCo2e;
        this.percentage = percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotalCo2e() {
        return totalCo2e;
    }

    public void setTotalCo2e(BigDecimal totalCo2e) {
        this.totalCo2e = totalCo2e;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
