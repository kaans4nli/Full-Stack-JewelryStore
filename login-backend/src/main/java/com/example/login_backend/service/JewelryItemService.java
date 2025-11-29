package com.example.login_backend.service;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.entity.Category;
import com.example.login_backend.entity.JewelryItem;
import com.example.login_backend.entity.Material;
import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.repository.CategoryRepository;
import com.example.login_backend.repository.JewelryItemRepository;
import com.example.login_backend.repository.MaterialRepository;
import com.example.login_backend.repository.ProductImageRepository;
import com.example.login_backend.spec.JewelryItemSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JewelryItemService {

    private final JewelryItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;
    private final ProductImageRepository imageRepository;
    private final StorageService storageService; // << inject edilmiş

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
    public JewelryItemDto create(JewelryItemDto dto, List<MultipartFile> images) {

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
                .build();

        JewelryItem saved = itemRepository.save(item);

        // Ensure images list is initialized on entity so item.getImages() != null
        if (saved.getImages() == null) {
            saved.setImages(new ArrayList<>());
        }

        // 1) Eğer DTO içinde gallery URL'leri varsa (ör. edit ekranından gelen URL'ler)
        if (dto.getGalleryImages() != null && !dto.getGalleryImages().isEmpty()) {
            for (int i = 0; i < dto.getGalleryImages().size(); i++) {
                String imgUrl = dto.getGalleryImages().get(i);
                ProductImage img = ProductImage.builder()
                        .imageUrl(imgUrl)
                        .isMain(saved.getImageUrl() == null && i == 0) // ilk URL ana resim olabilir
                        .jewelryItem(saved)
                        .build();
                imageRepository.save(img);
                saved.getImages().add(img);

                // Eğer ürünün imageUrl'i boşsa ilk URL'i main yap
                if (saved.getImageUrl() == null && (dto.getMainImageUrl() == null || dto.getMainImageUrl().isEmpty()) && i == 0) {
                    saved.setImageUrl(imgUrl);
                    itemRepository.save(saved);
                }
            }
        }

        // 2) Eğer multipart/form-data ile gerçek dosyalar geldiyse, upload edip kaydet
        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                // upload file using StorageService
                String fileUrl = storageService.upload(file);

                ProductImage img = ProductImage.builder()
                        .imageUrl(fileUrl)
                        .isMain(saved.getImageUrl() == null && (saved.getImages() == null || saved.getImages().isEmpty()) && i == 0)
                        .jewelryItem(saved)
                        .build();
                imageRepository.save(img);
                saved.getImages().add(img);

                // Eğer henüz ana resim yoksa ilk uploaded resmi ana resim yap
                if (saved.getImageUrl() == null) {
                    saved.setImageUrl(fileUrl);
                    itemRepository.save(saved);
                }
            }
        } else if (dto.getMainImageUrl() != null && !dto.getMainImageUrl().isEmpty() && saved.getImageUrl() == null) {
            // Eğer sadece DTO içinde mainImageUrl verilmişse set et
            saved.setImageUrl(dto.getMainImageUrl());
            itemRepository.save(saved);
        }

        return toDto(saved);
    }

    @Transactional
    public JewelryItemDto update(Long id, JewelryItemDto dto, List<MultipartFile> images) {

        JewelryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        // Ensure images list initialized
        if (item.getImages() == null) {
            item.setImages(new ArrayList<>());
        }

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

        // Eğer DTO içerisinde gallery URL'leri gönderilmişse (örn: düzenleme ekranında hali hazırdaki URL'ler)
        if (dto.getGalleryImages() != null && !dto.getGalleryImages().isEmpty()) {
            // Eğer istenirse önceki productImages temizlenip yeniden ekleme yapılabilir.
            // Bu örnekte mevcut resimleri koruyor, DTO'daki URL'leri yeni ekleme olarak ekliyoruz.
            for (int i = 0; i < dto.getGalleryImages().size(); i++) {
                String imgUrl = dto.getGalleryImages().get(i);
                ProductImage img = ProductImage.builder()
                        .imageUrl(imgUrl)
                        .isMain(false)
                        .jewelryItem(item)
                        .build();
                imageRepository.save(img);
                item.getImages().add(img);
            }
        }

        // Yeni dosyalar upload edilecekse
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String fileUrl = storageService.upload(file);
                ProductImage img = ProductImage.builder()
                        .imageUrl(fileUrl)
                        .isMain(false)
                        .jewelryItem(item)
                        .build();
                imageRepository.save(img);
                item.getImages().add(img);
            }
        }

        // Ana resim update mantığı (eğer DTO mainImageUrl vermişse ona göre, yoksa korunur)
        if (dto.getMainImageUrl() != null && !dto.getMainImageUrl().isEmpty()) {
            item.setImageUrl(dto.getMainImageUrl());
        } else if ((item.getImageUrl() == null || item.getImageUrl().isEmpty()) && item.getImages() != null && !item.getImages().isEmpty()) {
            // Ana resim yoksa birincil kaydı imageUrl olarak ata
            item.setImageUrl(item.getImages().get(0).getImageUrl());
        }

        JewelryItem saved = itemRepository.save(item);
        return toDto(saved);
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
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .materialId(item.getMaterial() != null ? item.getMaterial().getId() : null)
                .materialName(item.getMaterial() != null ? item.getMaterial().getName() : null)
                .mainImageUrl(item.getImageUrl())
                .galleryImages(
                        item.getImages() != null
                                ? item.getImages().stream().map(ProductImage::getImageUrl).toList()
                                : List.of() // null yerine boş liste tercih ettim
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
