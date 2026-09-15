package com.carbon.carbon_tracker.dto;

import java.math.BigDecimal;

public class UserStatDto {
    private String name;
    private String email;
    private BigDecimal co2e;

    public UserStatDto() {}

    public UserStatDto(String name, String email, BigDecimal co2e) {
        this.name = name;
        this.email = email;
        this.co2e = co2e;
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

    public BigDecimal getCo2e() {
        return co2e;
    }

    public void setCo2e(BigDecimal co2e) {
        this.co2e = co2e;
    }
}
