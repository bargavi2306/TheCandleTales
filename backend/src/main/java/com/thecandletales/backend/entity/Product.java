package com.thecandletales.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "category_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_product_category")
    )
    private Category category;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0.00")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 150, message = "Fragrance description must not exceed 150 characters")
    @Column(name = "fragrance", length = 150)
    private String fragrance;

    @Size(max = 50, message = "Burn time must not exceed 50 characters")
    @Column(name = "burn_time", length = 50)
    private String burnTime;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Builder.Default
    @Column(name = "stock", nullable = false)
    private Integer stock = 0;

    @NotNull
    @Builder.Default
    @Column(name = "featured", nullable = false)
    private Boolean featured = false;

    @NotNull
    @Builder.Default
    @Column(name = "best_seller", nullable = false)
    private Boolean bestSeller = false;

    @Builder.Default
    @OneToMany(
        mappedBy = "product", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true, 
        fetch = FetchType.LAZY
    )
    private List<ProductImage> images = new ArrayList<>();
}
