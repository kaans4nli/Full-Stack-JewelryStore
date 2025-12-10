package com.example.login_backend.service;

import com.example.login_backend.dto.OrderDto;
import com.example.login_backend.dto.OrderItemDto;
import com.example.login_backend.dto.CreateOrderResponse;
import com.example.login_backend.entity.*;
import com.example.login_backend.repository.*;
import com.stripe.model.PaymentIntent;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.net.ApiResource;
import com.stripe.net.RequestOptions;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final JewelryItemService jewelryService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public OrderDto createOrder(Long userId, Long addressId, List<OrderItemDto> itemDtos) {
        BigDecimal total = itemDtos.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .userId(userId)
                .addressId(addressId)
                .totalPrice(total)
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> items = itemDtos.stream()
                .map(dto -> OrderItem.builder()
                        .order(savedOrder)
                        .jewelryId(dto.getJewelryId())
                        .quantity(dto.getQuantity())
                        .price(dto.getPrice())
                        .build())
                .collect(Collectors.toList());

        orderItemRepository.saveAll(items);

        savedOrder.setItems(items);

        return mapToDto(savedOrder);
    }

    public List<OrderDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

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

    @Transactional
    public CreateOrderResponse checkout(Long userId, Long addressId) throws StripeException {

        // Kullanıcının sepetini al
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Sepet bulunamadı"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Sepet boş, sipariş oluşturulamaz");
        }

        // OrderItemDto listesine dönüştür
        List<OrderItemDto> itemDtos = cartItems.stream()
                .map(ci -> {

                    // Sipariş öncesi stok azalt
                    jewelryService.reduceStock(ci.getJewelryId(), ci.getQuantity());

                    return OrderItemDto.builder()
                            .jewelryId(ci.getJewelryId())
                            .quantity(ci.getQuantity())
                            .price(jewelryService.getPrice(ci.getJewelryId()))
                            .build();
                })
                .toList();

        // Order oluştur
        Order order = createOrderEntity(userId, addressId, itemDtos); // bunu aşağıya ekleyeceğiz

        // Sepeti boşalt
        cartItemRepository.deleteAll(cartItems);

        // Stripe API key
        Stripe.apiKey = stripeSecretKey;

        // Toplam fiyat kuruşa çevir
        long amount = order.getTotalPrice().multiply(BigDecimal.valueOf(100)).longValue();

        // PaymentIntent oluştur
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .putMetadata("orderId", order.getId().toString())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        // PaymentIntent ID siparişe kaydet
        order.setPaymentIntentId(intent.getId());
        orderRepository.save(order);

        // Frontend'e clientSecret gönder
        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .clientSecret(intent.getClientSecret())
                .build();
    }

    private Order createOrderEntity(Long userId, Long addressId, List<OrderItemDto> itemDtos) {

        BigDecimal total = itemDtos.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .userId(userId)
                .addressId(addressId)
                .totalPrice(total)
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> items = itemDtos.stream()
                .map(dto -> OrderItem.builder()
                        .order(savedOrder)
                        .jewelryId(dto.getJewelryId())
                        .quantity(dto.getQuantity())
                        .price(dto.getPrice())
                        .build())
                .collect(Collectors.toList());

        orderItemRepository.saveAll(items);

        savedOrder.setItems(items);

        return savedOrder;
    }
}
