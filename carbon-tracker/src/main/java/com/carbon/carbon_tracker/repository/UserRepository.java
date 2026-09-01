package com.carbon.carbon_tracker.repository;
import com.carbon.carbon_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    java.util.List<User> findByOrganizationId(Long organizationId);
}
