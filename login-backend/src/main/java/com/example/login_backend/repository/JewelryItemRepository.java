package com.example.login_backend.repository;

import com.example.login_backend.entity.JewelryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JewelryItemRepository extends JpaRepository<JewelryItem, Long>, JpaSpecificationExecutor<JewelryItem> {
}
