package com.carbon.carbon_tracker.dto;
import java.math.BigDecimal;
public class AnalyticsSummaryResponse {
    private BigDecimal todayCo2e;
    private BigDecimal weeklyCo2e;
    private BigDecimal monthlyCo2e;
    private BigDecimal previousWeeklyCo2e;
    public AnalyticsSummaryResponse(BigDecimal t, BigDecimal w, BigDecimal m, BigDecimal pw) { this.todayCo2e = t; this.weeklyCo2e = w; this.monthlyCo2e = m; this.previousWeeklyCo2e = pw; }
    public BigDecimal getTodayCo2e() { return todayCo2e; }
    public BigDecimal getWeeklyCo2e() { return weeklyCo2e; }
    public BigDecimal getMonthlyCo2e() { return monthlyCo2e; }
    public BigDecimal getPreviousWeeklyCo2e() { return previousWeeklyCo2e; }
}
