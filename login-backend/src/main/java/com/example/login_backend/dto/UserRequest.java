package com.example.login_backend.dto;

import com.example.login_backend.entity.User;

public record UserRequest(
        String username,
        String email,
        String password,
        User.Role role
) {}
