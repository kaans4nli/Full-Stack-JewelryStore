package com.example.login_backend.controller;

import com.example.login_backend.service.UserService;
import com.example.login_backend.dto.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import com.example.login_backend.dto.ProfileResponse;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication);
    }

    // 🔹 Adresler
    @GetMapping("/addresses")
    public List<AddressDto> getAddresses(Authentication authentication) {
        return userService.getAddresses(authentication);
    }

    @PostMapping("/addresses")
    public AddressDto addAddress(Authentication authentication, @RequestBody AddressRequest request) {
        return userService.addAddress(authentication, request);
    }

    @PutMapping("/addresses/{id}")
    public AddressDto updateAddress(Authentication authentication, @PathVariable Long id, @RequestBody AddressRequest request) {
        return userService.updateAddress(authentication, id, request);
    }

    @DeleteMapping("/addresses/{id}")
    public void deleteAddress(Authentication authentication, @PathVariable Long id) {
        userService.deleteAddress(authentication, id);
    }
}