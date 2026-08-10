package com.thecandletales.backend.specification;

import com.thecandletales.backend.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> hasNameOrDescriptionLike(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) return null;
            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Product> hasCategoryId(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> isFeatured(Boolean featured) {
        return (root, query, cb) -> featured == null ? null : cb.equal(root.get("featured"), featured);
    }

    public static Specification<Product> isBestSeller(Boolean bestSeller) {
        return (root, query, cb) -> bestSeller == null ? null : cb.equal(root.get("bestSeller"), bestSeller);
    }

    public static Specification<Product> priceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null ? null : cb.ge(root.get("price"), minPrice);
    }

    public static Specification<Product> priceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null ? null : cb.le(root.get("price"), maxPrice);
    }

    public static Specification<Product> hasNameLike(String name) {
        return (root, query, cb) -> {
            if (name == null || name.trim().isEmpty()) return null;
            return cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasCategoryNameLike(String categoryName) {
        return (root, query, cb) -> {
            if (categoryName == null || categoryName.trim().isEmpty()) return null;
            return cb.like(cb.lower(root.get("category").get("name")), "%" + categoryName.trim().toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasFragranceLike(String fragrance) {
        return (root, query, cb) -> {
            if (fragrance == null || fragrance.trim().isEmpty()) return null;
            return cb.like(cb.lower(root.get("fragrance")), "%" + fragrance.trim().toLowerCase() + "%");
        };
    }
}
