package com.example.login_backend.service;

import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.dto.OrderItemDto;
import com.example.login_backend.entity.*;
import com.example.login_backend.repository.OrderItemRepository;
import com.example.login_backend.repository.OrderRepository;
import com.example.login_backend.repository.UserRepository;
import com.example.login_backend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final JewelryItemService jewelryService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    // -------------------------------------------------------------
    // 1) ORDER CREATE
    // -------------------------------------------------------------
    @Transactional
    public OrderDto createOrder(Long userId, Long addressId, List<OrderItemDto> items) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalPrice(calculateTotal(items))
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = items.stream()
                .map(i -> {
                    jewelryService.reduceStock(i.getJewelryId(), i.getQuantity());

                    return OrderItem.builder()
                            .order(savedOrder)
                            .jewelryId(i.getJewelryId())
                            .quantity(i.getQuantity())
                            .price(i.getPrice())
                            .build();
                })
                .toList();

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        return mapToDto(savedOrder);
    }

    // -------------------------------------------------------------
    // 2) USER ID ile siparişler
    // -------------------------------------------------------------
    public List<OrderDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // 3) EMAIL ile siparişler (JWT)
    // -------------------------------------------------------------
    public List<OrderDto> getOrdersByEmail(String email) {
        return orderRepository.findByUser_Email(email)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // 4) ORDER DETAIL
    // -------------------------------------------------------------
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return mapToDto(order);
    }

    // -------------------------------------------------------------
    // 5) CANCEL ORDER
    // -------------------------------------------------------------
    @Transactional
    public OrderDto cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order already cancelled");
        }

        // stok iade
        if (order.getItems() != null) {
            order.getItems().forEach(item ->
                    jewelryService.reduceStock(
                            item.getJewelryId(),
                            -item.getQuantity()
                    )
            );
        }

        order.setStatus(OrderStatus.CANCELLED);

        return mapToDto(order);
    }

    // -------------------------------------------------------------
    // 6) TRACKING
    // -------------------------------------------------------------
    public String getTrackingInfo(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return order.getStatus().getDescription();
    }

    // -------------------------------------------------------------
    // TOTAL CALCULATION
    // -------------------------------------------------------------
    private BigDecimal calculateTotal(List<OrderItemDto> items) {
        return items.stream()
                .map(i -> i.getPrice()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // -------------------------------------------------------------
    // DTO MAPPER
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
                .userId(order.getUser().getId())
                .addressId(order.getAddress().getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}