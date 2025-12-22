package com.example.login_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long userId;
    private Long addressId;
    private List<OrderItemDto> items;
}
