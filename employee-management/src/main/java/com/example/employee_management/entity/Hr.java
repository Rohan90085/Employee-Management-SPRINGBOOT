package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hr")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Hr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;
}