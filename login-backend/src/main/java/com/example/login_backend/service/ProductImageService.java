package com.example.login_backend.service;

import com.example.login_backend.entity.JewelryItem;
import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.repository.JewelryItemRepository;
import com.example.login_backend.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        ProductImage img = ProductImage.builder()
                .imageUrl(imageUrl)
                .isMain(false)
                .jewelryItem(item)
                .build();

        return imageRepository.save(img);
    }

    public void deleteImage(Long imageId) {
        imageRepository.deleteById(imageId);
    }
}
