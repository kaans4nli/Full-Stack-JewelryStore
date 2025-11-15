package com.example.login_backend.service;

import com.example.login_backend.dto.CategoryDto;
import com.example.login_backend.entity.Category;
import com.example.login_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(cat -> new CategoryDto(cat.getId(), cat.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDto getById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        return new CategoryDto(c.getId(), c.getName());
    }

    public CategoryDto create(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Category already exists");
        }

        Category c = new Category();
        c.setName(dto.getName());

        Category saved = categoryRepository.save(c);

        return new CategoryDto(saved.getId(), saved.getName());
    }

    public CategoryDto update(Long id, CategoryDto dto) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        c.setName(dto.getName());

        Category saved = categoryRepository.save(c);

        return new CategoryDto(saved.getId(), saved.getName());
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
