package com.thecandletales.backend.controller;

import com.thecandletales.backend.dto.ApiResponse;
import com.thecandletales.backend.dto.ProductRequest;
import com.thecandletales.backend.dto.ProductResponse;
import com.thecandletales.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<ProductResponse> products = productService.getAllProducts(
                search, categoryId, featured, bestSeller, minPrice, maxPrice
        );
        return ResponseEntity.ok(ApiResponse.of("Products fetched successfully", products));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fragrance
    ) {
        List<ProductResponse> products = productService.searchProducts(name, category, fragrance);
        return ResponseEntity.ok(ApiResponse.of("Products matching criteria fetched successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.of("Product fetched successfully", product));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        ProductResponse product = productService.createProduct(request, files);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of("Product created successfully", product));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        ProductResponse product = productService.updateProduct(id, request, files);
        return ResponseEntity.ok(ApiResponse.of("Product updated successfully", product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build());
    }
}
