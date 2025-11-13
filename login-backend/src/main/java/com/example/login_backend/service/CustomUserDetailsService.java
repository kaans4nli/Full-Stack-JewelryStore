package com.example.login_backend.service;

import com.example.login_backend.config.JwtUtil;
import com.example.login_backend.dto.*;
import com.example.login_backend.entity.Address;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.AddressRepository;
import com.example.login_backend.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CustomUserDetailsService(UserRepository userRepository,
                                    AddressRepository addressRepository,
                                    @Lazy PasswordEncoder passwordEncoder,
                                    JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Kullanıcı girişi
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

    // 🔹 Kayıt
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

    // 🔹 Adresleri getir
    @Override
    public List<AddressDto> getAddresses(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return addressRepository.findByUser(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 🔹 Adres ekle
    @Override
    public AddressDto addAddress(Authentication authentication, AddressRequest request) {
        User user = getAuthenticatedUser(authentication);

        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(request.isDefault())
                .build();

        return toDto(addressRepository.save(address));
    }

    // 🔹 Adres güncelle
    @Override
    public AddressDto updateAddress(Authentication authentication, Long addressId, AddressRequest request) {
        User user = getAuthenticatedUser(authentication);

        Address address = addressRepository.findById(addressId)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı veya yetkiniz yok."));

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());

        return toDto(addressRepository.save(address));
    }

    // 🔹 Adres sil
    @Override
    public void deleteAddress(Authentication authentication, Long addressId) {
        User user = getAuthenticatedUser(authentication);

        Address address = addressRepository.findById(addressId)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı veya yetkiniz yok."));

        addressRepository.delete(address);
    }

    // 🔹 Security metodu
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

    // 🔹 Yardımcı metotlar
    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + username));
    }

    private AddressDto toDto(Address a) {
        return AddressDto.builder()
                .id(a.getId())
                .fullName(a.getFullName())
                .phone(a.getPhone())
                .addressLine(a.getAddressLine())
                .city(a.getCity())
                .postalCode(a.getPostalCode())
                .country(a.getCountry())
                .isDefault(a.isDefault())
                .build();
    }
}
