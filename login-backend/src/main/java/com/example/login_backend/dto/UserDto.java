package com.example.login_backend.dto;

import com.example.login_backend.entity.User;

public record UserDto(
        Long id,
        String username,
        String email,
        User.Role role
) {}
