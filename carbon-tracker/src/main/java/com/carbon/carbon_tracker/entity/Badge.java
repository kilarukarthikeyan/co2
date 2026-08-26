package com.carbon.carbon_tracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "badges")
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @Column(name = "criteria_type")
    private String criteriaType;
    
    @Column(name = "criteria_value")
    private BigDecimal criteriaValue;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCriteriaType() { return criteriaType; }
    public void setCriteriaType(String criteriaType) { this.criteriaType = criteriaType; }
    public BigDecimal getCriteriaValue() { return criteriaValue; }
    public void setCriteriaValue(BigDecimal criteriaValue) { this.criteriaValue = criteriaValue; }
}
