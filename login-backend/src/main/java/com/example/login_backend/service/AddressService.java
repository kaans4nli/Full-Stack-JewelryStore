package com.example.login_backend.service;

import com.example.login_backend.dto.AddressDto;
import com.example.login_backend.dto.AddressRequest;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface AddressService {
    List<AddressDto> getAddresses(Authentication authentication);
    AddressDto getAddressById(Authentication authentication, Long addressId);
    AddressDto addAddress(Authentication authentication, AddressRequest request);
    AddressDto updateAddress(Authentication authentication, Long addressId, AddressRequest request);
    AddressDto setDefaultAddress(Authentication authentication, Long id);
    void deleteAddress(Authentication authentication, Long addressId);
}
