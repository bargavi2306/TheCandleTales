package com.thecandletales.backend.controller;

import com.thecandletales.backend.dto.ApiResponse;
import com.thecandletales.backend.dto.CategoryRequest;
import com.thecandletales.backend.dto.CategoryResponse;
import com.thecandletales.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.of("Categories fetched successfully", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.of("Category fetched successfully", category));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @RequestPart("category") @Valid CategoryRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        CategoryResponse category = categoryService.createCategory(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of("Category created successfully", category));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @RequestPart("category") @Valid CategoryRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        CategoryResponse category = categoryService.updateCategory(id, request, file);
        return ResponseEntity.ok(ApiResponse.of("Category updated successfully", category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Category deleted successfully")
                .build());
    }
}
