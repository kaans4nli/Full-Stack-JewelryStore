package com.example.login_backend.service;

import com.example.login_backend.dto.MaterialDto;
import com.example.login_backend.entity.Material;
import com.example.login_backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;

    public List<MaterialDto> getAll() {
        return materialRepository.findAll()
                .stream()
                .map(m -> new MaterialDto(m.getId(), m.getName()))
                .collect(Collectors.toList());
    }

    public MaterialDto getById(Long id) {
        Material m = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));

        return new MaterialDto(m.getId(), m.getName());
    }

    public MaterialDto create(MaterialDto dto) {
        if (materialRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Material already exists");
        }

        Material m = new Material();
        m.setName(dto.getName());

        Material saved = materialRepository.save(m);

        return new MaterialDto(saved.getId(), saved.getName());
    }

    public MaterialDto update(Long id, MaterialDto dto) {
        Material m = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material not found"));

        m.setName(dto.getName());

        Material saved = materialRepository.save(m);

        return new MaterialDto(saved.getId(), saved.getName());
    }

    public void delete(Long id) {
        materialRepository.deleteById(id);
    }
}
