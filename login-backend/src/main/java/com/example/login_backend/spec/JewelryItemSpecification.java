package com.example.login_backend.spec;

import com.example.login_backend.entity.JewelryItem;
import org.springframework.data.jpa.domain.Specification;

public class JewelryItemSpecification {

    public static Specification<JewelryItem> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern)
            );
        };
    }

    public static Specification<JewelryItem> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return null;
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }

    public static Specification<JewelryItem> hasMaterial(Long materialId) {
        return (root, query, cb) -> {
            if (materialId == null) return null;
            return cb.equal(root.get("material").get("id"), materialId);
        };
    }
}
