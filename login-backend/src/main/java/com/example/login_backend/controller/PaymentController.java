package com.example.login_backend.controller;

import com.example.login_backend.dto.CreatePaymentRequest;
import com.example.login_backend.service.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody CreatePaymentRequest request) throws StripeException {
        String clientSecret = paymentService.createPaymentIntent(request.getOrderId());
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }
}
