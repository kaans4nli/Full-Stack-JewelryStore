package com.example.login_backend.spec;

import com.example.login_backend.entity.JewelryItem;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class JewelryItemSpecification {

    public static Specification<JewelryItem> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank())
                return cb.conjunction();

            String like = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }

    public static Specification<JewelryItem> hasCategory(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<JewelryItem> hasMaterial(Long materialId) {
        return (root, query, cb) ->
                materialId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("material").get("id"), materialId);
    }

    public static Specification<JewelryItem> minPrice(BigDecimal min) {
        return (root, query, cb) ->
                min == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<JewelryItem> maxPrice(BigDecimal max) {
        return (root, query, cb) ->
                max == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<JewelryItem> inStockOnly(Boolean inStock) {
        return (root, query, cb) ->
                (inStock == null || !inStock)
                        ? cb.conjunction()
                        : cb.greaterThan(root.get("stockQuantity"), 0);
    }
}