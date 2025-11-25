package com.example.login_backend.controller;

import com.example.login_backend.service.UserService;
import com.example.login_backend.dto.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import com.example.login_backend.dto.ProfileResponse;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication);
    }
}