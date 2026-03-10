package com.example.login_backend.controller.admin;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.service.JewelryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("api/admin/jewelry-items")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class JewelryItemController {

    private final JewelryItemService service;

    @GetMapping
    public List<JewelryItemDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public JewelryItemDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JewelryItemDto create(
            @RequestPart("item") JewelryItemDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return service.create(dto, images);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public JewelryItemDto update(
            @PathVariable Long id,
            @RequestPart("item") JewelryItemDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return service.update(id, dto, images);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public Page<JewelryItemDto> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long materialId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return service.searchItems(
                keyword,
                categoryId,
                materialId,
                minPrice,
                maxPrice,
                inStock,
                page,
                size,
                sortBy,
                direction
        ).map(service::toDto);
    }
}
