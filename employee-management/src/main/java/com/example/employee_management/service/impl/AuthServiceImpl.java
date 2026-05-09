package com.example.employee_management.service.impl;

import com.example.employee_management.dto.LoginRequestDTO;
import com.example.employee_management.dto.LoginResponseDTO;
import com.example.employee_management.entity.Hr;
import com.example.employee_management.exception.UnauthorizedException;
import com.example.employee_management.repository.HrRepository;
import com.example.employee_management.security.JwtUtil;
import com.example.employee_management.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final HrRepository hrRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            HrRepository hrRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.hrRepository = hrRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {

        Hr hr = hrRepository.findByUsername(dto.getUsername())
                .orElseThrow(() ->
                        new UnauthorizedException("Invalid Username"));

        boolean valid = passwordEncoder.matches(
                dto.getPassword(),
                hr.getPassword()
        );

        if (!valid) {
            throw new UnauthorizedException("Invalid Password");
        }

        String token =
                jwtUtil.generateToken(hr.getUsername());

        return new LoginResponseDTO(token);
    }
}