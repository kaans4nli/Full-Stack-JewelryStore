package com.example.login_backend.controller.admin;

import com.example.login_backend.dto.JewelryItemDto;
import com.example.login_backend.service.JewelryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("api/admin/jewelry-items")
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

    @PostMapping
    public JewelryItemDto create(@RequestBody JewelryItemDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public JewelryItemDto update(
            @PathVariable Long id,
            @RequestBody JewelryItemDto dto
    ) {
        return service.update(id, dto);
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.searchItems(keyword, categoryId, materialId, page, size)
                .map(service::toDto);  // entity -> dto dönüşümü
    }
}
