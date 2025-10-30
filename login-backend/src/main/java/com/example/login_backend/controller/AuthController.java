package com.example.login_backend.controller;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.JwtResponse;
import com.example.login_backend.dto.LoginRequest;
import com.example.login_backend.dto.RegisterRequest;
import com.example.login_backend.entity.RefreshToken;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.service.RefreshTokenService;
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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    public AuthController(AuthenticationManager authManager, JwtUtil jwt, RefreshTokenService rts,
                          UserRepository ur, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authManager;
        this.jwtUtil = jwt;
        this.refreshTokenService = rts;
        this.userRepository = ur;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtil.generateJwtToken(authentication);
        User user = userRepository.findByUsername(loginRequest.username())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(refreshExpirationMs / 1000)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        User user = new User(registerRequest.username(),
                passwordEncoder.encode(registerRequest.password()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenCookie = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (refreshTokenCookie == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is missing");
        }

        Optional<RefreshToken> maybeToken = refreshTokenService.findByToken(refreshTokenCookie);
        if (maybeToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        try {
            RefreshToken token = refreshTokenService.verifyExpiration(maybeToken.get());
            User user = token.getUser();

            // Rotate: eski token sil, yeni token oluştur
            refreshTokenService.deleteByUserId(user.getId());
            RefreshToken newToken = refreshTokenService.createRefreshToken(user.getId());

            String newAccessToken = jwtUtil.generateTokenFromUsername(user.getUsername());

            ResponseCookie cookie = ResponseCookie.from("refreshToken", newToken.getToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(refreshExpirationMs / 1000)
                    .sameSite("Lax")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(new JwtResponse(newAccessToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired. Please login again.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        String cookieValue = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (cookieValue != null) {
            refreshTokenService.deleteByToken(cookieValue);
        }

        return ResponseEntity.ok("Logged out successfully");
    }
}