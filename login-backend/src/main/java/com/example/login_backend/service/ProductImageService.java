package com.example.login_backend.service;

import com.example.login_backend.entity.JewelryItem;
import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.repository.JewelryItemRepository;
import com.example.login_backend.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository imageRepository;
    private final JewelryItemRepository itemRepository;

    public List<ProductImage> getImages(Long itemId) {
        JewelryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        return item.getImages();
    }

    public ProductImage addImage(Long itemId, String imageUrl) {
        JewelryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (item.getImages() == null) {
            item.setImages(new ArrayList<>());
        }

        boolean isFirstImage = item.getImages().isEmpty();

        ProductImage img = ProductImage.builder()
                .imageUrl(imageUrl)
                .isMain(isFirstImage)
                .jewelryItem(item)
                .build();

        ProductImage saved = imageRepository.save(img);

        item.getImages().add(saved);

        if (isFirstImage) {
            item.setImageUrl(imageUrl);
            itemRepository.save(item);
        }

        return saved;
    }

    public void deleteImage(Long imageId) {
        imageRepository.deleteById(imageId);
    }
}
