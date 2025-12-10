package com.example.login_backend.controller;

import com.example.login_backend.service.WebhookService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final WebhookService webhookService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping
    public ResponseEntity<String> handle(@RequestHeader("Stripe-Signature") String sigHeader,
                                         @RequestBody String payload) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        switch (event.getType()) {

            case "payment_intent.succeeded":
                PaymentIntent successIntent = (PaymentIntent) event.getDataObjectDeserializer()
                        .getObject().orElse(null);

                if (successIntent != null) {
                    webhookService.handlePaymentIntentSucceeded(successIntent.getId());
                }
                break;

            case "payment_intent.payment_failed":
                PaymentIntent failedIntent = (PaymentIntent) event.getDataObjectDeserializer()
                        .getObject().orElse(null);

                if (failedIntent != null) {
                    webhookService.handlePaymentIntentFailed(failedIntent.getId());
                }
                break;

            default:
                break;
        }

        return ResponseEntity.ok("received");
    }
}
