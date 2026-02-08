package com.example.login_backend.service;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.JwtResponse;
import com.example.login_backend.dto.LoginRequest;
import com.example.login_backend.dto.RegisterRequest;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 🔹 LOGIN
    public JwtResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Hatalı şifre");
        }

        String token = jwtUtil.generateTokenFromUsername(
                user.getUsername(),
                List.of("ROLE_" + user.getRole().name())
        );

        return new JwtResponse(token);
    }

    // 🔹 REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Bu kullanıcı adı zaten alınmış");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
        return "OK";
    }
}
