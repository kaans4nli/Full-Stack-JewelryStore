package com.example.login_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
    private String fullName;
    private String phone;
    private String addressLine;
    private String city;
    private String postalCode;
    private String country;
    private boolean isDefault;
}
