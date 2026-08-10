package com.thecandletales.backend.service.impl;

import com.thecandletales.backend.dto.CategoryRequest;
import com.thecandletales.backend.dto.CategoryResponse;
import com.thecandletales.backend.entity.Category;
import com.thecandletales.backend.exception.BadRequestException;
import com.thecandletales.backend.exception.ResourceNotFoundException;
import com.thecandletales.backend.repository.CategoryRepository;
import com.thecandletales.backend.service.CategoryService;
import com.thecandletales.backend.service.StorageService;
import com.thecandletales.backend.service.UploadResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thecandletales.backend.exception.DuplicateResourceException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, MultipartFile file) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category already exists with name: " + request.getName());
        }

        String imageUrl = request.getImage();
        String publicId = null;
        if (file != null && !file.isEmpty()) {
            UploadResult result = storageService.upload(file);
            imageUrl = result.getUrl();
            publicId = result.getPublicId();
        }

        Category category = Category.builder()
                .name(request.getName())
                .image(imageUrl)
                .imagePublicId(publicId)
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request, MultipartFile file) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        if (categoryRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new DuplicateResourceException("Category already exists with name: " + request.getName());
        }

        category.setName(request.getName());
        
        if (file != null && !file.isEmpty()) {
            if (category.getImage() != null) {
                storageService.delete(category.getImagePublicId(), category.getImage());
            }
            UploadResult result = storageService.upload(file);
            category.setImage(result.getUrl());
            category.setImagePublicId(result.getPublicId());
        } else {
            if (request.getImage() == null || !request.getImage().equals(category.getImage())) {
                if (category.getImage() != null) {
                    storageService.delete(category.getImagePublicId(), category.getImage());
                }
                category.setImagePublicId(null);
            }
            category.setImage(request.getImage());
        }
        
        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Specific delete protection check before database cascade runs
        if (!category.getProducts().isEmpty()) {
            throw new BadRequestException("Cannot delete category because it contains active products.");
        }
        
        if (category.getImage() != null) {
            storageService.delete(category.getImagePublicId(), category.getImage());
        }
        
        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .image(category.getImage())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
