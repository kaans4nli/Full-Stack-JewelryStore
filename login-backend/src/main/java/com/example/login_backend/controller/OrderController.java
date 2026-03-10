package com.example.login_backend.controller;

import com.example.login_backend.dto.CreateOrderRequest;
import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.entity.User;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.service.OrderService;
import com.example.login_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // 🔹 1) Stripe ödeme başarılı → Sipariş oluştur
    @PostMapping("/create")
    public OrderDto createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(
                request.getUserId(),
                request.getAddressId(),
                request.getItems()
        );
    }

    // 🔹 2) Login olmuş kullanıcının siparişleri (/user/me)
    @GetMapping("/user/me")
    public List<OrderDto> getMyOrders(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + username));

        return orderService.getOrdersByEmail(user.getEmail());
    }

    // 🔹 3) Belirli userId’ye göre siparişler (admin için)
    @GetMapping("/user/{userId}")
    public List<OrderDto> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    // 🔹 4) Order detay
    @GetMapping("/{orderId}")
    public OrderDto getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // 🔹 5) Sipariş iptal
    @PostMapping("/{orderId}/cancel")
    public OrderDto cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }

    // 🔹 6) Tracking bilgisi
    @GetMapping("/{orderId}/tracking")
    public String getOrderTracking(@PathVariable Long orderId) {
        return orderService.getTrackingInfo(orderId);
    }
}