
package com.sabari.employee_leave_management.service;

import com.sabari.employee_leave_management.AppUser;
import com.sabari.employee_leave_management.repository.AppUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser createUser(
            String username,
            String rawPassword,
            String role,
            Long employeeId) {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                "Username is required."
            );
        }

        if (rawPassword == null || rawPassword.length() < 8) {
            throw new IllegalArgumentException(
                "Password must contain at least 8 characters."
            );
        }

        if (!"ADMIN".equals(role) && !"EMPLOYEE".equals(role)) {
            throw new IllegalArgumentException(
                "Role must be ADMIN or EMPLOYEE."
            );
        }

        if ("EMPLOYEE".equals(role) && employeeId == null) {
            throw new IllegalArgumentException(
                "An employee account must have an employee ID."
            );
        }

        if (appUserRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException(
                "Username already exists."
            );
        }

        AppUser user = new AppUser();
        user.setUsername(username.trim());
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setEmployeeId(employeeId);
        user.setEnabled(true);

        return appUserRepository.save(user);
    }
}
