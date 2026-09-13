package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PeriodAnalyticsResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal periodTotalCo2e;
    private BigDecimal dailyAverage;
    private long logCount;
    private Double peerPercentile;
    private String topCategory;
    private BigDecimal topCategoryCo2e;

    public PeriodAnalyticsResponse(LocalDate startDate, LocalDate endDate, BigDecimal periodTotalCo2e, 
                                   BigDecimal dailyAverage, long logCount, Double peerPercentile, 
                                   String topCategory, BigDecimal topCategoryCo2e) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.periodTotalCo2e = periodTotalCo2e;
        this.dailyAverage = dailyAverage;
        this.logCount = logCount;
        this.peerPercentile = peerPercentile;
        this.topCategory = topCategory;
        this.topCategoryCo2e = topCategoryCo2e;
    }

    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public BigDecimal getPeriodTotalCo2e() { return periodTotalCo2e; }
    public BigDecimal getDailyAverage() { return dailyAverage; }
    public long getLogCount() { return logCount; }
    public Double getPeerPercentile() { return peerPercentile; }
    public String getTopCategory() { return topCategory; }
    public BigDecimal getTopCategoryCo2e() { return topCategoryCo2e; }
}
