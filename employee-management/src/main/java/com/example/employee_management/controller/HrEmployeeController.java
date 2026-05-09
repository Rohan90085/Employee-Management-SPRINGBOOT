package com.example.employee_management.controller;

import com.example.employee_management.dto.SalaryIncrementDTO;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin("*")
public class HrEmployeeController {

    private final EmployeeService employeeService;

    public HrEmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/employees")
    public Employee addEmployee(
            @Valid @RequestBody Employee employee) {

        return employeeService.addEmployee(employee);
    }

    @PutMapping("/employees/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return employeeService.updateEmployee(id, employee);
    }

    @DeleteMapping("/employees/{id}")
    public String deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee deleted successfully";
    }

    @GetMapping("/employees")
    public List<Employee> getAllEmployees() {

        return employeeService.getAllEmployees();
    }

    @PutMapping("/increment/{id}")
    public Employee incrementSalary(
            @PathVariable Long id,
            @RequestBody SalaryIncrementDTO dto) {

        return employeeService.incrementSalary(id, dto);
    }
}