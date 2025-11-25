package com.example.login_backend.spec;

import com.example.login_backend.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> hasKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return (root, query, builder) -> builder.conjunction();
        }

        String like = "%" + keyword.toLowerCase() + "%";

        return (root, query, builder) ->
                builder.or(
                        builder.like(builder.lower(root.get("username")), like),
                        builder.like(builder.lower(root.get("email")), like)
                );
    }
}
