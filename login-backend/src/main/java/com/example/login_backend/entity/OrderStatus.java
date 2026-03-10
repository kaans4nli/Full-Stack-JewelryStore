package com.example.login_backend.entity;

import lombok.Getter;

@Getter
public enum OrderStatus {

    PENDING("Order created. Awaiting payment."),
    PAID("Payment received. Preparing your order."),
    SHIPPED("Your order has been shipped."),
    DELIVERED("Order delivered successfully."),
    FAILED("Payment failed. Please try again."),
    CANCELLED("Order was cancelled.");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }
}
