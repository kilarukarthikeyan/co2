package com.carbon.carbon_tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @Column(name = "join_token")
    private String joinToken;

    @Column(name = "sustainability_target")
    private Double sustainabilityTarget;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getJoinToken() { return joinToken; }
    public void setJoinToken(String joinToken) { this.joinToken = joinToken; }
    public Double getSustainabilityTarget() { return sustainabilityTarget; }
    public void setSustainabilityTarget(Double sustainabilityTarget) { this.sustainabilityTarget = sustainabilityTarget; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
