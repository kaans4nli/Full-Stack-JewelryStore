package com.example.login_backend.controller;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.service.JewelryItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/api/jewelry")   // User'a açık endpoint
@CrossOrigin(origins = "http://localhost:5173")
public class JewelryPublicController {

    private final JewelryItemService jewelryService;

    public JewelryPublicController(JewelryItemService jewelryService) {
        this.jewelryService = jewelryService;
    }

    // 1) Kullanıcı -> Tüm ürünleri görsün
    @GetMapping
    public List<JewelryItemDto> getAllJewelryItems() {
        return jewelryService.getAll();
    }

    // 2) Kullanıcı -> ID'ye göre tek ürün görsün
    @GetMapping("/{id}")
    public JewelryItemDto getJewelryItemById(@PathVariable Long id) {
        return jewelryService.getById(id);
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
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return jewelryService.searchItems(
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
        ).map(jewelryService::toDto);
    }
}
