package com.example.login_backend.service;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.*;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomUserDetailsService(UserRepository userRepository,
                                    @Lazy PasswordEncoder passwordEncoder,
                                    JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Login
    @Override
    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Geçersiz kullanıcı adı veya şifre!");
        }

        String token = jwtUtil.generateTokenFromUsername(user.getUsername());
        return new JwtResponse(token);
    }

    // 🔹 Register
    @Override
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Bu kullanıcı adı zaten alınmış!");
        }

        if (request.email() != null && userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Bu e-posta zaten kullanılıyor!");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(User.Role.USER)
                .build();

        userRepository.save(user);

        return "Kayıt başarılı!";
    }

    // 🔹 Profil bilgisi
    @Override
    public ProfileResponse getProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return new ProfileResponse(user.getId(), user.getUsername(), user.getRole().name());
    }

    // 🔹 Security
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    // 🔹 Helper
    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + username));
    }
}
