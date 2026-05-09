package com.example.employee_management.config;

import com.example.employee_management.entity.Hr;
import com.example.employee_management.repository.HrRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final HrRepository hrRepository;

    public CustomUserDetailsService(HrRepository hrRepository) {
        this.hrRepository = hrRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Hr hr = hrRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("HR not found"));

        return new User(
                hr.getUsername(),
                hr.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_HR")
                )
        );
    }
}