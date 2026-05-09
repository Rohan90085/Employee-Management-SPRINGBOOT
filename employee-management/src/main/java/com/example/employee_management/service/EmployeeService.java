package com.example.employee_management.service;

import com.example.employee_management.dto.SalaryIncrementDTO;
import com.example.employee_management.entity.Employee;

import java.util.List;

public interface EmployeeService {

    Employee addEmployee(Employee employee);

    Employee updateEmployee(Long id, Employee employee);

    void deleteEmployee(Long id);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

    List<Employee> searchEmployeeByName(String name);

    Employee incrementSalary(Long id, SalaryIncrementDTO dto);
}