package com.example.login_backend.controller;

import com.example.login_backend.dto.CreateOrderResponse;
import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.dto.OrderItemDto;
import com.example.login_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public OrderDto createOrder(@RequestParam Long userId,
                                @RequestParam Long addressId,
                                @RequestBody List<OrderItemDto> items) {
        return orderService.createOrder(userId, addressId, items);
    }

    @GetMapping("/user/{userId}")
    public List<OrderDto> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PostMapping("/checkout")
    public CreateOrderResponse checkout(@RequestParam Long userId,
                                        @RequestParam Long addressId) throws Exception {
        return orderService.checkout(userId, addressId);
    }
}
