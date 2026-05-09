package com.example.employee_management.dto;

import lombok.Data;

@Data
public class EmployeeRequestDTO {

    private String name;

    private String email;

    private String department;

    private String designation;

    private Double salary;
}