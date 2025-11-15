package com.example.login_backend.controller.admin;

import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService service;

    @GetMapping("/{itemId}")
    public List<ProductImage> getImages(@PathVariable Long itemId) {
        return service.getImages(itemId);
    }

    @PostMapping("/{itemId}")
    public ProductImage addImage(@PathVariable Long itemId, @RequestBody String imageUrl) {
        return service.addImage(itemId, imageUrl);
    }

    @DeleteMapping("/{imageId}")
    public void deleteImage(@PathVariable Long imageId) {
        service.deleteImage(imageId);
    }
}
