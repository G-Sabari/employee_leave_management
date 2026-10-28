
package com.sabari.employee_leave_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sabari.employee_leave_management.AppUser;

public interface AppUserRepository
        extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);
}
