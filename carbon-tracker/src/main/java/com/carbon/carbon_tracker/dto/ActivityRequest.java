package com.carbon.carbon_tracker.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
public class ActivityRequest {
    private String category;
    private String activityType;
    private BigDecimal quantity;
    private String unit;
    private LocalDate logDate;
    private String memo;
    // getters/setters
    public String getCategory() { return category; } public void setCategory(String category) { this.category = category; }
    public String getActivityType() { return activityType; } public void setActivityType(String activityType) { this.activityType = activityType; }
    public BigDecimal getQuantity() { return quantity; } public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; } public void setUnit(String unit) { this.unit = unit; }
    public LocalDate getLogDate() { return logDate; } public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public String getMemo() { return memo; } public void setMemo(String memo) { this.memo = memo; }
}
