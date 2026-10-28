package com.sabari.employee_leave_management.repository;


import com.sabari.employee_leave_management.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  EmployeeRepository 
        extends JpaRepository<Employee,Long> {
    

}
