package com.thecandletales.backend.service;

import com.thecandletales.backend.dto.CategoryRequest;
import com.thecandletales.backend.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse createCategory(CategoryRequest request, org.springframework.web.multipart.MultipartFile file);
    CategoryResponse updateCategory(Long id, CategoryRequest request, org.springframework.web.multipart.MultipartFile file);
    void deleteCategory(Long id);
}
