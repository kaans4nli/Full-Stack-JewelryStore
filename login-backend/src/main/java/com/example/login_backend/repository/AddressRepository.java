package com.example.login_backend.repository;

import com.example.login_backend.entity.Address;
import com.example.login_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
}
