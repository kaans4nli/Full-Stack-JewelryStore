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
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return;

        try {
            // "/uploads/123_test.jpg" -> "123_test.jpg" kısmını alıyoruz
            String filename = imageUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir).resolve(filename);

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Silme hatası kritik olmayabilir, loglayıp geçebilirsin
            System.err.println("Dosya fiziksel olarak silinemedi: " + imageUrl);
        }
    }
}

//Dinamik yapmak için:
//String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
//        .build()
//        .toUriString();
//return baseUrl + "/uploads/" + filename;
