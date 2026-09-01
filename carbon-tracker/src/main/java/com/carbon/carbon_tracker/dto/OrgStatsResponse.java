package com.carbon.carbon_tracker.dto;

public class OrgStatsResponse {
    private long activeEmployees;
    private double avgDailyCo2PerEmployee;
    private double totalCo2Saved;

    public OrgStatsResponse(long activeEmployees, double avgDailyCo2PerEmployee, double totalCo2Saved) {
        this.activeEmployees = activeEmployees;
        this.avgDailyCo2PerEmployee = avgDailyCo2PerEmployee;
        this.totalCo2Saved = totalCo2Saved;
    }

    public long getActiveEmployees() { return activeEmployees; }
    public double getAvgDailyCo2PerEmployee() { return avgDailyCo2PerEmployee; }
    public double getTotalCo2Saved() { return totalCo2Saved; }
}
