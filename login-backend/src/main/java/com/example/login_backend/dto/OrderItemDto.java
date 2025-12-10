package com.example.login_backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long jewelryId;
    private Integer quantity;
    private BigDecimal price;
}
