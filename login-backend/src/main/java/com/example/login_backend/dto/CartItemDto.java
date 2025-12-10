package com.example.login_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {
    private Long id;
    private Long jewelryId;
    private JewelryItemDto jewelry;
    private Integer quantity;
}
