package com.carbon.carbon_tracker.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
public class GoalRequest {
    private BigDecimal targetReductionPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    // getters/setters
    public BigDecimal getTargetReductionPercentage() { return targetReductionPercentage; } public void setTargetReductionPercentage(BigDecimal t) { this.targetReductionPercentage = t; }
    public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
