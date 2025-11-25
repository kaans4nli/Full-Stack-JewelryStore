package com.example.login_backend.service;

import com.example.login_backend.dto.AddressDto;
import com.example.login_backend.dto.AddressRequest;
import com.example.login_backend.entity.Address;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.AddressRepository;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.service.AddressService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository,
                              UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AddressDto> getAddresses(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return addressRepository.findByUser(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto getAddressById(Authentication authentication, Long id) {
        User user = getAuthenticatedUser(authentication);

        Address address = addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı veya yetkiniz yok."));

        return toDto(address);
    }

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

    @Override
    public AddressDto updateAddress(Authentication authentication, Long id, AddressRequest request) {
        User user = getAuthenticatedUser(authentication);

        Address address = addressRepository.findById(id)
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

    @Override
    public AddressDto setDefaultAddress(Authentication authentication, Long id) {
        User user = getAuthenticatedUser(authentication);

        // Yeni varsayılan adres
        Address newDefault = addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı veya yetkiniz yok."));

        // Mevcut varsayılan adresi sıfırla
        addressRepository.findByUser(user).stream()
                .filter(Address::isDefault)
                .forEach(addr -> {
                    addr.setDefault(false);
                    addressRepository.save(addr);
                });

        // Yeni adresi varsayılan yap
        newDefault.setDefault(true);
        addressRepository.save(newDefault);

        return toDto(newDefault);
    }

    @Override
    public void deleteAddress(Authentication authentication, Long id) {
        User user = getAuthenticatedUser(authentication);

        Address address = addressRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Adres bulunamadı veya yetkiniz yok."));

        addressRepository.delete(address);
    }

    // --- Private helpers ---

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
