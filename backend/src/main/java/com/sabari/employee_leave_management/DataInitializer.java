
package com.sabari.employee_leave_management;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sabari.employee_leave_management.repository.AppUserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (appUserRepository.findByUsername("admin").isEmpty()) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setPasswordHash(
                    passwordEncoder.encode("Admin123")
                );
                admin.setRole("ADMIN");
                admin.setEmployeeId(null);
                admin.setEnabled(true);

                appUserRepository.save(admin);
                System.out.println("Initial admin account created.");
            }
        };
    }
}
