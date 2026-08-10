package com.thecandletales.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0.00")
    private BigDecimal price;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 150, message = "Fragrance description must not exceed 150 characters")
    private String fragrance;

    @Size(max = 50, message = "Burn time must not exceed 50 characters")
    private String burnTime;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotNull(message = "Featured flag is required")
    private Boolean featured;

    @NotNull(message = "Best seller flag is required")
    private Boolean bestSeller;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
}
