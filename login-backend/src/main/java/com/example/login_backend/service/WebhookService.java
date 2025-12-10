package com.example.login_backend.service;

import com.example.login_backend.entity.Order;
import com.example.login_backend.entity.OrderStatus;
import com.example.login_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WebhookService {

    private final OrderRepository orderRepository;

    public WebhookService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /** PaymentIntent başarılı → PAID */
    public void handlePaymentIntentSucceeded(String paymentIntentId) {
        Optional<Order> optionalOrder = orderRepository.findByPaymentIntentId(paymentIntentId);

        if (optionalOrder.isEmpty()) {
            System.out.println("⚠ Order bulunamadı: paymentIntentId=" + paymentIntentId);
            return;
        }

        Order order = optionalOrder.get();
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        System.out.println("✅ Order güncellendi → PAID | Order ID = " + order.getId());
    }

    /** PaymentIntent başarısız → FAILED */
    public void handlePaymentIntentFailed(String paymentIntentId) {
        Optional<Order> optionalOrder = orderRepository.findByPaymentIntentId(paymentIntentId);

        if (optionalOrder.isEmpty()) {
            System.out.println("⚠ FAILED Order bulunamadı: paymentIntentId=" + paymentIntentId);
            return;
        }

        Order order = optionalOrder.get();
        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);

        System.out.println("❌ Ödeme başarısız → FAILED | Order ID = " + order.getId());
    }
}