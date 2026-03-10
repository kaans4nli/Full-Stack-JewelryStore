package com.example.login_backend.controller.admin;

import com.example.login_backend.entity.ProductImage;
import com.example.login_backend.service.ProductImageService;
import com.example.login_backend.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/admin/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService service;
    private final StorageService storageService;

    @GetMapping("/{itemId}")
    public List<ProductImage> getImages(@PathVariable Long itemId) {
        return service.getImages(itemId);
    }

    @PostMapping("/{itemId}")
    public ProductImage addImage(@PathVariable Long itemId, @RequestBody String imageUrl) {
        return service.addImage(itemId, imageUrl);
    }

    @PostMapping(value = "/{itemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductImage uploadImage(
            @PathVariable Long itemId,
            @RequestPart("image") MultipartFile file
    ) {
        String url = storageService.upload(file);
        return service.addImage(itemId, url);
    }

    @DeleteMapping("/{imageId}")
    public void deleteImage(@PathVariable Long imageId) {
        service.deleteImage(imageId);
    }
}
