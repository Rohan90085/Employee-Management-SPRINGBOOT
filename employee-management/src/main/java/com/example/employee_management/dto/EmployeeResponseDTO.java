package com.example.employee_management.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String department;

    private String designation;

    private Double salary;
}