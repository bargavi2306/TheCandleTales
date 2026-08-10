package com.thecandletales.backend.service.impl;

import com.thecandletales.backend.service.StorageService;
import com.thecandletales.backend.service.UploadResult;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageServiceImpl implements StorageService {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public LocalStorageServiceImpl() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the upload directory.", ex);
        }
    }

    @Override
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot store empty file.");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + uniqueFileName, ex);
        }
    }

    @Override
    public UploadResult upload(MultipartFile file) {
        String url = store(file);
        return new UploadResult(url, null);
    }

    @Override
    public void delete(String publicId, String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return;
        }
        try {
            if (imageUrl.startsWith("/uploads/")) {
                String fileName = imageUrl.substring("/uploads/".length());
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ex) {
            throw new RuntimeException("Failed to delete local file: " + imageUrl, ex);
        }
    }
}
