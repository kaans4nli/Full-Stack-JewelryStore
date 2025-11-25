package com.example.login_backend.controller;

import com.example.login_backend.dto.AddressDto;
import com.example.login_backend.dto.AddressRequest;
import com.example.login_backend.service.AddressService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public List<AddressDto> getAddresses(Authentication authentication) {
        return addressService.getAddresses(authentication);
    }

    @GetMapping("/{id}")
    public AddressDto getAddressById(Authentication authentication, @PathVariable Long id) {
        return addressService.getAddressById(authentication, id);
    }

    @PostMapping
    public AddressDto addAddress(Authentication authentication, @RequestBody AddressRequest request) {
        return addressService.addAddress(authentication, request);
    }

    @PutMapping("/{id}")
    public AddressDto updateAddress(Authentication authentication,
                                    @PathVariable Long id,
                                    @RequestBody AddressRequest request) {
        return addressService.updateAddress(authentication, id, request);
    }

    @PutMapping("/{id}/default")
    public AddressDto setDefaultAddress(Authentication authentication, @PathVariable Long id) {
        return addressService.setDefaultAddress(authentication, id);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(Authentication authentication, @PathVariable Long id) {
        addressService.deleteAddress(authentication, id);
    }
}
