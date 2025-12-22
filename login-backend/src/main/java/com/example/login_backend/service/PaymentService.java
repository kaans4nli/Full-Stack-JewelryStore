package com.example.login_backend.service;

import com.example.login_backend.entity.Order;
import com.example.login_backend.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public String createPaymentIntent(Long orderId) throws StripeException {

        Stripe.apiKey = stripeSecretKey;

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        long amountInCent = order.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(amountInCent)
                        .setCurrency("usd")
                        .putMetadata("orderId", orderId.toString())
                        .build();

        PaymentIntent intent = PaymentIntent.create(params);

        order.setPaymentIntentId(intent.getId());
        orderRepository.save(order);

        return intent.getClientSecret();
    }
}
