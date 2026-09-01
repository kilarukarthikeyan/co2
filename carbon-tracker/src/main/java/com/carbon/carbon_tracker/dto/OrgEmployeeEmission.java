package com.carbon.carbon_tracker.dto;

public class OrgEmployeeEmission {
    private String name;
    private String email;
    private double totalCo2e;
    private int logCount;

    public OrgEmployeeEmission(String name, String email, double totalCo2e, int logCount) {
        this.name = name;
        this.email = email;
        this.totalCo2e = totalCo2e;
        this.logCount = logCount;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public double getTotalCo2e() { return totalCo2e; }
    public int getLogCount() { return logCount; }
}
