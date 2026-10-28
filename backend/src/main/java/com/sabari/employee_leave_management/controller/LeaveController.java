
package com.sabari.employee_leave_management.controller;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.sabari.employee_leave_management.Leave;
import com.sabari.employee_leave_management.repository.LeaveRepository;
import com.sabari.employee_leave_management.repository.EmployeeRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class LeaveController {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveController(
            LeaveRepository leaveRepository,
            EmployeeRepository employeeRepository) {

        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    // POST: Apply for leave
    @PostMapping("/leaves")
    public Leave applyLeave(@RequestBody Leave leave) {

        // Check whether dates are provided
        if (leave.getStartDate() == null || leave.getEndDate() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Start date and end date are required");
        }

        // Check whether end date is before start date
        if (leave.getEndDate().isBefore(leave.getStartDate())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "End date cannot be before start date");
        }

        // Check whether employee exists
        if (leave.getEmployeeId() == null ||
                !employeeRepository.existsById(leave.getEmployeeId())) {

            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Employee not found with ID: " + leave.getEmployeeId());
        }

        // Set initial status
        leave.setStatus("PENDING");

        // Save leave request
        return leaveRepository.save(leave);
    }

    // GET: View all leave requests
    @GetMapping("/leaves")
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // GET: View leave requests by employee ID
    @GetMapping("/leaves/employee/{employeeId}")
    public List<Leave> getLeavesByEmployee(
            @PathVariable Long employeeId) {

        return leaveRepository.findByEmployeeId(employeeId);
    }

    // PUT: Approve leave request
    @PutMapping("/leaves/{id}/approve")
    public Leave approveLeave(@PathVariable Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave not found: " + id));

        if (!"PENDING".equals(leave.getStatus())) {
           throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only pending leave requests can be approved");
                    }

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    // PUT: Reject leave request
    @PutMapping("/leaves/{id}/reject")
    public Leave rejectLeave(@PathVariable Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Leave not found: " + id));

        if (!"PENDING".equals(leave.getStatus())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only pending leave requests can be rejected");
        }

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }
}
