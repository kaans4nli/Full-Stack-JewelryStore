package com.example.login_backend.service;

import com.example.login_backend.dto.ProfileResponse;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public ProfileResponse getProfile(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        // 🔥 JWT içinden gelen GERÇEK kullanıcı
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }

    // Eğer login/register burada değilse boş bırakabilirsin
}
