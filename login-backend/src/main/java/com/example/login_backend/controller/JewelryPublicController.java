package com.example.login_backend.controller;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.service.JewelryItemService;
import org.springframework.web.bind.annotation.*;

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
}
