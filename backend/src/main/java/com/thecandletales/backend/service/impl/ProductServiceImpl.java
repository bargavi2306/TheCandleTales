package com.thecandletales.backend.service.impl;

import com.thecandletales.backend.dto.CategoryResponse;
import com.thecandletales.backend.dto.ProductImageResponse;
import com.thecandletales.backend.dto.ProductRequest;
import com.thecandletales.backend.dto.ProductResponse;
import com.thecandletales.backend.entity.Category;
import com.thecandletales.backend.entity.Product;
import com.thecandletales.backend.entity.ProductImage;
import com.thecandletales.backend.exception.ResourceNotFoundException;
import com.thecandletales.backend.repository.CategoryRepository;
import com.thecandletales.backend.repository.ProductRepository;
import com.thecandletales.backend.specification.ProductSpecification;
import com.thecandletales.backend.service.ProductService;
import com.thecandletales.backend.service.StorageService;
import com.thecandletales.backend.service.UploadResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thecandletales.backend.exception.BadRequestException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(
            String search,
            Long categoryId,
            Boolean featured,
            Boolean bestSeller,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        if (search != null) {
            spec = spec.and(ProductSpecification.hasNameOrDescriptionLike(search));
        }
        if (categoryId != null) {
            spec = spec.and(ProductSpecification.hasCategoryId(categoryId));
        }
        if (featured != null) {
            spec = spec.and(ProductSpecification.isFeatured(featured));
        }
        if (bestSeller != null) {
            spec = spec.and(ProductSpecification.isBestSeller(bestSeller));
        }
        if (minPrice != null) {
            spec = spec.and(ProductSpecification.priceGreaterThanOrEqual(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(ProductSpecification.priceLessThanOrEqual(maxPrice));
        }

        return productRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, List<MultipartFile> files) {
        List<UploadResult> imagesToSave = new ArrayList<>();
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                imagesToSave.add(new UploadResult(url, null));
            }
        }

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    UploadResult res = storageService.upload(file);
                    imagesToSave.add(res);
                }
            }
        }

        if (imagesToSave.isEmpty()) {
            throw new BadRequestException("At least one product image is required.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .fragrance(request.getFragrance())
                .burnTime(request.getBurnTime())
                .stock(request.getStock())
                .featured(request.getFeatured())
                .bestSeller(request.getBestSeller())
                .images(new ArrayList<>())
                .build();

        // Map and link image URLs and public IDs
        for (int i = 0; i < imagesToSave.size(); i++) {
            UploadResult res = imagesToSave.get(i);
            ProductImage img = ProductImage.builder()
                    .product(product)
                    .imageUrl(res.getUrl())
                    .publicId(res.getPublicId())
                    .displayOrder(i)
                    .build();
            product.getImages().add(img);
        }

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, List<MultipartFile> files) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 1. Identify which old images are removed
        List<ProductImage> oldImages = new ArrayList<>(product.getImages());
        List<String> keptUrls = request.getImageUrls() != null ? request.getImageUrls() : new ArrayList<>();

        List<ProductImage> imagesToDelete = oldImages.stream()
                .filter(img -> !keptUrls.contains(img.getImageUrl()))
                .collect(Collectors.toList());

        // 2. Delete removed images from Cloudinary
        for (ProductImage img : imagesToDelete) {
            storageService.delete(img.getPublicId(), img.getImageUrl());
        }

        // 3. Upload new images
        List<UploadResult> newImageResults = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    UploadResult uploadResult = storageService.upload(file);
                    newImageResults.add(uploadResult);
                }
            }
        }

        if (keptUrls.isEmpty() && newImageResults.isEmpty()) {
            throw new BadRequestException("At least one product image is required.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setCategory(category);
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setFragrance(request.getFragrance());
        product.setBurnTime(request.getBurnTime());
        product.setStock(request.getStock());
        product.setFeatured(request.getFeatured());
        product.setBestSeller(request.getBestSeller());

        // 4. Re-build product images list preserving display order
        product.getImages().clear();
        int displayOrder = 0;

        // Keep old kept images
        for (ProductImage oldImg : oldImages) {
            if (keptUrls.contains(oldImg.getImageUrl())) {
                ProductImage img = ProductImage.builder()
                        .product(product)
                        .imageUrl(oldImg.getImageUrl())
                        .publicId(oldImg.getPublicId())
                        .displayOrder(displayOrder++)
                        .build();
                product.getImages().add(img);
            }
        }

        // Add new images
        for (UploadResult result : newImageResults) {
            ProductImage img = ProductImage.builder()
                    .product(product)
                    .imageUrl(result.getUrl())
                    .publicId(result.getPublicId())
                    .displayOrder(displayOrder++)
                    .build();
            product.getImages().add(img);
        }

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String name, String category, String fragrance) {
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        if (name != null) {
            spec = spec.and(ProductSpecification.hasNameLike(name));
        }
        if (category != null) {
            spec = spec.and(ProductSpecification.hasCategoryNameLike(category));
        }
        if (fragrance != null) {
            spec = spec.and(ProductSpecification.hasFragranceLike(fragrance));
        }

        return productRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        // Delete all images associated with the product from Cloudinary
        for (ProductImage img : product.getImages()) {
            storageService.delete(img.getPublicId(), img.getImageUrl());
        }
        
        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .image(product.getCategory().getImage())
                .createdAt(product.getCategory().getCreatedAt())
                .updatedAt(product.getCategory().getUpdatedAt())
                .build();

        List<ProductImageResponse> imageResponses = product.getImages().stream()
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .displayOrder(img.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .category(categoryResponse)
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .fragrance(product.getFragrance())
                .burnTime(product.getBurnTime())
                .stock(product.getStock())
                .featured(product.getFeatured())
                .bestSeller(product.getBestSeller())
                .images(imageResponses)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
