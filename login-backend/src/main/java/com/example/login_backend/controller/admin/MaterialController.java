package com.example.login_backend.controller.admin;

import com.example.login_backend.dto.MaterialDto;
import com.example.login_backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService service;

    @GetMapping
    public List<MaterialDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public MaterialDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public MaterialDto create(@RequestBody MaterialDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public MaterialDto update(@PathVariable Long id, @RequestBody MaterialDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
