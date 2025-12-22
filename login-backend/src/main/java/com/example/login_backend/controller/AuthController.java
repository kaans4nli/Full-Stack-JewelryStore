package com.example.login_backend.controller;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.JwtResponse;
import com.example.login_backend.dto.LoginRequest;
import com.example.login_backend.dto.RegisterRequest;
import com.example.login_backend.entity.RefreshToken;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwtRefreshExpirationMs}")
    private Long refreshExpirationMs;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            RefreshTokenService refreshTokenService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 🔄 refresh token rotation (login)
        refreshTokenService.deleteByUserId(user.getId());
        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                buildRefreshCookie(refreshToken.getToken()).toString()
        );

        String accessToken = jwtUtil.generateJwtToken(authentication);
        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

    /* ================= REGISTER ================= */

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest()
                    .body("Username already exists");
        }

        User user = new User(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password())
        );

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    /* ================= REFRESH ================= */

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String tokenValue = extractRefreshToken(request);

        if (tokenValue == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token missing");
        }

        RefreshToken refreshToken = refreshTokenService
                .findByToken(tokenValue)
                .orElseThrow(() ->
                        new RuntimeException("Invalid refresh token"));

        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();

        // 🔄 ROTATION
        refreshTokenService.deleteByUserId(user.getId());
        RefreshToken newToken =
                refreshTokenService.createRefreshToken(user.getId());

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                buildRefreshCookie(newToken.getToken()).toString()
        );

        String newAccessToken =
                jwtUtil.generateTokenFromUsername(user.getUsername());

        return ResponseEntity.ok(new JwtResponse(newAccessToken));
    }

    /* ================= LOGOUT ================= */

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String tokenValue = extractRefreshToken(request);

        if (tokenValue != null) {
            refreshTokenService.deleteByToken(tokenValue);
        }

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                deleteRefreshCookie().toString()
        );

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out");
    }

    /* ================= HELPERS ================= */

    private String extractRefreshToken(HttpServletRequest request) {
        return Arrays.stream(
                        Optional.ofNullable(request.getCookies())
                                .orElse(new Cookie[0])
                )
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false) // PROD: true
                .path("/")
                .maxAge(refreshExpirationMs / 1000)
                .sameSite("Lax") // PROD: None
                .build();
    }

    private ResponseCookie deleteRefreshCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }
}
