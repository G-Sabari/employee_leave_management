
package com.sabari.employee_leave_management.controller;

import com.sabari.employee_leave_management.AppUser;
import com.sabari.employee_leave_management.LoginRequest;
import com.sabari.employee_leave_management.repository.AppUserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository appUserRepository;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            AppUserRepository appUserRepository,
            SecurityContextRepository securityContextRepository) {

        this.authenticationManager = authenticationManager;
        this.appUserRepository = appUserRepository;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(),
                                    request.getPassword()
                            )
                    );

            // Create a new security context after successful login
            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            // Save the authenticated context to the HTTP session
            securityContextRepository.saveContext(
                    context, httpRequest, httpResponse
            );

            AppUser appUser = appUserRepository
                    .findByUsername(authentication.getName())
                    .orElseThrow();

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "username", appUser.getUsername(),
                    "role", appUser.getRole(),
                    "employeeId", appUser.getEmployeeId() == null
                            ? 0L : appUser.getEmployeeId()
            ));

        } catch (org.springframework.security.core.AuthenticationException ex) {

            SecurityContextHolder.clearContext();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Invalid username or password"
                    ));
        }
    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        AppUser appUser = appUserRepository
                .findByUsername(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(Map.of(
                "username", appUser.getUsername(),
                "role", appUser.getRole(),
                "employeeId", appUser.getEmployeeId() == null
                        ? 0L : appUser.getEmployeeId()
        ));
    }

    
     
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        SecurityContextHolder.clearContext();

        jakarta.servlet.http.HttpSession session =
                request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logout successful")
        );
    }
   
}
