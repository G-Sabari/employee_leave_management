package com.sabari.employee_leave_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmployeeLeaveManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeLeaveManagementApplication.class, args);

		
		Employee emp1 = new Employee("sabari","sabari@gmail.com");
		Employee emp2 = new Employee("rohit","rohit@gmail.com");
	}

}
