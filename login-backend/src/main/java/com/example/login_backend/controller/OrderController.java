package com.example.login_backend.controller;

import com.example.login_backend.dto.CreateOrderRequest;
import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 2) Stripe ödeme başarılı → Sipariş oluştur
    @PostMapping("/create")
    public OrderDto createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(
                request.getUserId(),
                request.getAddressId(),
                request.getItems()
        );
    }

    // 3) Kullanıcının siparişleri
    @GetMapping("/user/{userId}")
    public List<OrderDto> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }
}
