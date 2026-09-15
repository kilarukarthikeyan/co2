package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyEmissionDto {
    private LocalDate date;
    private BigDecimal co2e;

    public DailyEmissionDto() {}

    public DailyEmissionDto(LocalDate date, BigDecimal co2e) {
        this.date = date;
        this.co2e = co2e;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getCo2e() {
        return co2e;
    }

    public void setCo2e(BigDecimal co2e) {
        this.co2e = co2e;
    }
}
