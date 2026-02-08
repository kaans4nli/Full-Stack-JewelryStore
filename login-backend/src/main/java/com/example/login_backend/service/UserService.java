package com.example.login_backend.service;

import java.util.List;
import com.example.login_backend.dto.*;
import org.springframework.security.core.Authentication;

public interface UserService {
    ProfileResponse getProfile(Authentication authentication);
}