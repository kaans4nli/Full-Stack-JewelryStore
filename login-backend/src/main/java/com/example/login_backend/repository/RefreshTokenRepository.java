package com.example.login_backend.repository;

import com.example.login_backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    /**
     * Kullanıcıya ait tüm refresh tokenları siler.
     * @return silinen satır sayısı
     */
    @Transactional
    Integer deleteByUserId(Long userId);
}