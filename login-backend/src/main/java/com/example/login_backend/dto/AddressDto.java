package com.example.login_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private Long id;
    private String fullName;
    private String phone;
    private String addressLine;
    private String city;
    private String postalCode;
    private String country;

    @JsonProperty("isDefault")
    private boolean isDefault;
}
