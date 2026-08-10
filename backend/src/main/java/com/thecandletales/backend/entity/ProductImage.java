package com.thecandletales.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage extends BaseCreatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "product_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_product_image")
    )
    private Product product;

    @NotBlank(message = "Image URL is required")
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Size(max = 255, message = "Public ID must not exceed 255 characters")
    @Column(name = "public_id", length = 255)
    private String publicId;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order cannot be negative")
    @Builder.Default
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
