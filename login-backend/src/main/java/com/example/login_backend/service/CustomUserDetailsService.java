package com.example.login_backend.service;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.*;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginInput) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(loginInput, loginInput)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Kullanıcı bulunamadı (Username/Email): " + loginInput));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) // JWT içinde hala benzersiz username kalsın
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
