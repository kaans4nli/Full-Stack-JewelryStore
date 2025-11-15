package com.example.login_backend.service;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.entity.Category;
import com.example.login_backend.entity.JewelryItem;
import com.example.login_backend.entity.Material;
import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.repository.CategoryRepository;
import com.example.login_backend.repository.JewelryItemRepository;
import com.example.login_backend.spec.JewelryItemSpecification;
import com.example.login_backend.repository.MaterialRepository;
import com.example.login_backend.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JewelryItemService {

    private final JewelryItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;
    private final ProductImageRepository imageRepository;

    public List<JewelryItemDto> getAll() {
        return itemRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public JewelryItemDto getById(Long id) {
        return itemRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    }

    @Transactional
    public JewelryItemDto create(JewelryItemDto dto) {

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));

        JewelryItem item = JewelryItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .material(material)
                .imageUrl(dto.getMainImageUrl())
                .build();

        JewelryItem saved = itemRepository.save(item);

        // IMAGE GALLERY
        if (dto.getGalleryImages() != null) {
            for (String imgUrl : dto.getGalleryImages()) {
                ProductImage img = ProductImage.builder()
                        .imageUrl(imgUrl)
                        .isMain(false)
                        .jewelryItem(saved)
                        .build();
                imageRepository.save(img);
            }
        }

        return toDto(saved);
    }

    @Transactional
    public JewelryItemDto update(Long id, JewelryItemDto dto) {
        JewelryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setStockQuantity(dto.getStockQuantity());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            item.setCategory(category);
        }

        if (dto.getMaterialId() != null) {
            Material material = materialRepository.findById(dto.getMaterialId())
                    .orElseThrow(() -> new IllegalArgumentException("Material not found"));
            item.setMaterial(material);
        }

        if (dto.getMainImageUrl() != null) {
            item.setImageUrl(dto.getMainImageUrl());
        }

        return toDto(itemRepository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        itemRepository.deleteById(id);
    }


    // -----------------------------
    // DTO Mapping
    // -----------------------------
    public JewelryItemDto toDto(JewelryItem item) {
        return JewelryItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .stockQuantity(item.getStockQuantity())
                .categoryId(item.getCategory().getId())
                .materialId(item.getMaterial().getId())
                .mainImageUrl(item.getImageUrl())
                .galleryImages(
                        item.getImages() != null
                                ? item.getImages().stream().map(ProductImage::getImageUrl).toList()
                                : null
                )
                .build();
    }

    // -----------------------------
    // Search
    // -----------------------------
    public Page<JewelryItem> searchItems(
            String keyword,
            Long categoryId,
            Long materialId,
            int page,
            int size
    ) {
        Specification<JewelryItem> spec = JewelryItemSpecification.hasKeyword(keyword)
                .and(JewelryItemSpecification.hasCategory(categoryId))
                .and(JewelryItemSpecification.hasMaterial(materialId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return itemRepository.findAll(spec, pageable);
    }
}
