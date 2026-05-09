package com.example.employee_management.repository;

import com.example.employee_management.entity.Hr;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HrRepository
        extends JpaRepository<Hr, Long> {

    Optional<Hr> findByUsername(String username);
}