package com.example.employee_management.service;

import com.example.employee_management.dto.LoginRequestDTO;
import com.example.employee_management.dto.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO dto);
}