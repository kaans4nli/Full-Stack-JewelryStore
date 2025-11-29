package com.example.login_backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JewelryItemDto {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stockQuantity;

    private Long categoryId;
    private String categoryName;

    private Long materialId;
    private String materialName;

    private String mainImageUrl;

    private List<String> galleryImages;
}
