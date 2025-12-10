package com.example.login_backend.service;

import com.example.login_backend.entity.Cart;
import com.example.login_backend.repository.CartItemRepository;
import com.example.login_backend.repository.CartRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final JewelryItemService jewelryItemService;

    public Map<String, String> createPaymentIntent(Long userId) throws StripeException {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Sepet bulunamadı"));

        BigDecimal total = cartItemRepository.findByCartId(cart.getId()).stream()
                .map(ci -> jewelryItemService.getPrice(ci.getJewelryId())
                        .multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long amountInCents = total.multiply(BigDecimal.valueOf(100)).longValue();

        // metadata (kullanıcı ve cart id'si) — webhook tarafında kullanılacak
        Map<String, String> metadata = new HashMap<>();
        metadata.put("userId", String.valueOf(userId));
        metadata.put("cartId", String.valueOf(cart.getId()));

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("try")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods
                                .builder().setEnabled(true).build())
                .putAllMetadata(metadata)
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Map<String, String> result = new HashMap<>();
        result.put("clientSecret", intent.getClientSecret());
        result.put("paymentIntentId", intent.getId());
        return result;
    }
}
