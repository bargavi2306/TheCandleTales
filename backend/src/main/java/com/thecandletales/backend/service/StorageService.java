package com.thecandletales.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(MultipartFile file);
    UploadResult upload(MultipartFile file);
    void delete(String publicId, String imageUrl);
}
