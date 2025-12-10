package com.example.login_backend.controller;

import com.example.login_backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public Map<String, String> createPaymentIntent(@RequestParam Long userId) throws Exception {
        return paymentService.createPaymentIntent(userId);
    }
}
