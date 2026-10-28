
package com.sabari.employee_leave_management.controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.sabari.employee_leave_management.Employee;
import com.sabari.employee_leave_management.repository.EmployeeRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class HelloController {

    private final EmployeeRepository employeeRepository;

    public HelloController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // POST: Add an employee
    @PostMapping("/employees")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    // PUT: Update an employee
    @PutMapping("/employees/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with ID: " + id));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());

        return employeeRepository.save(existingEmployee);
    }

    //DELETE - Remove the Employee

    
    @DeleteMapping("/employees/{id}")
    public String deleteEmployee(@PathVariable Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found with ID: " + id));

        employeeRepository.delete(employee);

        return "Employee deleted successfully with ID: " + id;
    }


    // GET: Home message
    @GetMapping("/")
    public String home() {
        return "Employee Leave Management System is Running";
    }

    // GET: All employees
    @GetMapping("/employees")
    public List<Employee> employees() {
        return employeeRepository.findAll();
    }
}
