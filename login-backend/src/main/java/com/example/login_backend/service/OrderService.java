package com.example.login_backend.service;

import com.example.login_backend.dto.CreateOrderRequest;
import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.dto.OrderItemDto;
import com.example.login_backend.entity.Order;
import com.example.login_backend.entity.OrderItem;
import com.example.login_backend.entity.OrderStatus;
import com.example.login_backend.repository.OrderItemRepository;
import com.example.login_backend.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final JewelryItemService jewelryService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    // -------------------------------------------------------------
    // 2) ÖDEME BAŞARILI → SİPARİŞ KAYDI OLUŞTUR
    // -------------------------------------------------------------
    public OrderDto createOrder(Long userId, Long addressId, List<OrderItemDto> items) {

        Order order = Order.builder()
                .userId(userId)
                .addressId(addressId)
                .totalPrice(calculateTotal(items))
                .status(OrderStatus.PENDING)
                .build();

        Order saved = orderRepository.save(order);

        List<OrderItem> orderItems = items.stream()
                .map(i -> OrderItem.builder()
                        .order(saved)
                        .jewelryId(i.getJewelryId())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .toList();

        orderItemRepository.saveAll(orderItems);
        saved.setItems(orderItems);

        return mapToDto(saved);
    }

    // -------------------------------------------------------------
    // Kullanıcının siparişleri
    // -------------------------------------------------------------
    public List<OrderDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // Total hesaplama
    // -------------------------------------------------------------
    private BigDecimal calculateTotal(List<OrderItemDto> items) {
        return items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // -------------------------------------------------------------
    // DTO Mapper
    // -------------------------------------------------------------
    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> items = order.getItems() != null
                ? order.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .jewelryId(i.getJewelryId())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .collect(Collectors.toList())
                : List.of();

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .addressId(order.getAddressId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
