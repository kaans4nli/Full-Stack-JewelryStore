package com.example.login_backend.repository;

import com.example.login_backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
