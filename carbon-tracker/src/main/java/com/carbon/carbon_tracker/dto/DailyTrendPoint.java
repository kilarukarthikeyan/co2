package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyTrendPoint {
    private LocalDate date;
    private String label;
    private BigDecimal co2e;

    public DailyTrendPoint(LocalDate date, String label, BigDecimal co2e) {
        this.date = date;
        this.label = label;
        this.co2e = co2e;
    }

    public LocalDate getDate() { return date; }
    public String getLabel() { return label; }
    public BigDecimal getCo2e() { return co2e; }
}
