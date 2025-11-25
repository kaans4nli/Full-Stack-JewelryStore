package com.example.login_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {

    private final String uploadDir = "uploads/";

    @Override
    public String upload(MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(uploadDir));

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + filename);

            Files.write(filePath, file.getBytes());

            // Tarayıcıdan erişmek için
            return "/uploads/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
