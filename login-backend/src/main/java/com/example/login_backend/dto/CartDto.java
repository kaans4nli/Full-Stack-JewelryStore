package com.example.login_backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    private Long id;
    private Long userId;
    private LocalDateTime createdAt;
    private List<CartItemDto> items;
    private BigDecimal totalPrice;
}
