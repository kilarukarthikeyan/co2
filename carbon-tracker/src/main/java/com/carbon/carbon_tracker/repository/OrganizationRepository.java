package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
