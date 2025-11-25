package com.example.login_backend.service;

import java.util.List;
import com.example.login_backend.dto.*;
import org.springframework.security.core.Authentication;

public interface UserService {
    JwtResponse login(LoginRequest request);
    String register(RegisterRequest request);
    ProfileResponse getProfile(Authentication authentication);
}