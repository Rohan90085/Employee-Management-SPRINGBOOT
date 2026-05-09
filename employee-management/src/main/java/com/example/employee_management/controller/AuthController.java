package com.example.employee_management.controller;

import com.example.employee_management.dto.*;
import com.example.employee_management.entity.Hr;
import com.example.employee_management.repository.HrRepository;
import com.example.employee_management.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final HrRepository hrRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public AuthController(HrRepository hrRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {

        this.hrRepository = hrRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(
            @RequestBody LoginRequestDTO dto) {

        Hr hr = hrRepository.findByUsername(dto.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Username"));

        boolean valid = passwordEncoder.matches(
                dto.getPassword(),
                hr.getPassword()
        );

        if (!valid) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(hr.getUsername());

        return new LoginResponseDTO(token);
    }
}