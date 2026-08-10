package com.thecandletales.backend.service;

import com.thecandletales.backend.dto.ProductRequest;
import com.thecandletales.backend.dto.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts(
            String search,
            Long categoryId,
            Boolean featured,
            Boolean bestSeller,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request, List<org.springframework.web.multipart.MultipartFile> files);
    ProductResponse updateProduct(Long id, ProductRequest request, List<org.springframework.web.multipart.MultipartFile> files);
    List<ProductResponse> searchProducts(String name, String category, String fragrance);
    void deleteProduct(Long id);
}
