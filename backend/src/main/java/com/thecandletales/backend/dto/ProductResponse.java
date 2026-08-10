package com.thecandletales.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private CategoryResponse category;
    private String name;
    private BigDecimal price;
    private String description;
    private String fragrance;
    private String burnTime;
    private Integer stock;
    private Boolean featured;
    private Boolean bestSeller;
    
    @Builder.Default
    private List<ProductImageResponse> images = new ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
