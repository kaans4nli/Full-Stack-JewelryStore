package com.example.login_backend.repository;

import com.example.login_backend.entity.Order;
import com.example.login_backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);

    List<Order> findByUser_Email(String email);

    Optional<Order> findByPaymentIntentId(String paymentIntentId);

    List<Order> findByStatus(OrderStatus status);
}
