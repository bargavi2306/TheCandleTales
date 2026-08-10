package com.thecandletales.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.thecandletales.backend.service.StorageService;
import com.thecandletales.backend.service.UploadResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Primary
public class CloudinaryStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryStorageService.class);

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String store(MultipartFile file) {
        return upload(file).getUrl();
    }

    @Override
    public UploadResult upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file to Cloudinary.");
        }
        try {
            logger.info("Uploading file to Cloudinary: {}", file.getOriginalFilename());
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            logger.info("Successfully uploaded file. Secure URL: {}, Public ID: {}", secureUrl, publicId);
            return new UploadResult(secureUrl, publicId);
        } catch (IOException e) {
            logger.error("Failed to upload file to Cloudinary: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String publicId, String imageUrl) {
        String targetPublicId = (publicId != null && !publicId.trim().isEmpty()) ? publicId : extractPublicId(imageUrl);
        if (targetPublicId == null) {
            logger.warn("Could not determine Cloudinary public ID for deletion. imageUrl: {}, publicId: {}", imageUrl, publicId);
            return;
        }
        try {
            logger.info("Deleting image from Cloudinary with public ID: {}", targetPublicId);
            Map deleteResult = cloudinary.uploader().destroy(targetPublicId, ObjectUtils.emptyMap());
            logger.info("Cloudinary delete result for public ID {}: {}", targetPublicId, deleteResult);
        } catch (IOException e) {
            logger.error("Failed to delete image from Cloudinary with public ID: {}", targetPublicId, e);
            throw new RuntimeException("Cloudinary delete failed: " + e.getMessage(), e);
        }
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }
        if (!imageUrl.contains("cloudinary.com")) {
            return null;
        }
        try {
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) {
                return null;
            }
            String pathAfterUpload = imageUrl.substring(uploadIndex + 8);
            if (pathAfterUpload.startsWith("v")) {
                int firstSlash = pathAfterUpload.indexOf('/');
                if (firstSlash != -1 && pathAfterUpload.substring(1, firstSlash).matches("\\d+")) {
                    pathAfterUpload = pathAfterUpload.substring(firstSlash + 1);
                }
            }
            int lastDotIndex = pathAfterUpload.lastIndexOf('.');
            if (lastDotIndex != -1) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
            }
            return pathAfterUpload;
        } catch (Exception e) {
            logger.error("Error parsing Cloudinary public ID from URL: {}", imageUrl, e);
            return null;
        }
    }
}
