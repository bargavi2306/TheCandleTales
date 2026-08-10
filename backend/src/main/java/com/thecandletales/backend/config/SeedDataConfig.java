package com.thecandletales.backend.config;

import com.thecandletales.backend.entity.Admin;
import com.thecandletales.backend.entity.Category;
import com.thecandletales.backend.entity.Product;
import com.thecandletales.backend.entity.ProductImage;
import com.thecandletales.backend.repository.AdminRepository;
import com.thecandletales.backend.repository.CategoryRepository;
import com.thecandletales.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SeedDataConfig implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SeedDataConfig.class);

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Admin if none exist, skipping overwrite if already present
        Optional<Admin> existingAdminOpt = adminRepository.findByEmail("admin@thecandletales.com");
        if (existingAdminOpt.isPresent()) {
            logger.info("[SeedData] Default admin user already exists. Skipping password overwrite.");
        } else {
            Admin admin = Admin.builder()
                .name("Admin")
                .email("admin@thecandletales.com")
                .password(passwordEncoder.encode(System.getenv("ADMIN_DEFAULT_PASSWORD") != null ? System.getenv("ADMIN_DEFAULT_PASSWORD") : "admin123"))
                .build();
            adminRepository.save(admin);
            logger.info("[SeedData] Default admin user created and secured with BCrypt successfully.");
        }

        // 2. Seed Categories and Products if none exist
        if (categoryRepository.count() == 0) {
            Category scented = Category.builder()
                .name("Scented Candles")
                .image(null)
                .build();

            Category decorative = Category.builder()
                .name("Decorative Candles")
                .image(null)
                .build();

            // Save categories
            categoryRepository.saveAll(List.of(scented, decorative));
            logger.info("[SeedData] Categories seeded successfully.");

            if (productRepository.count() == 0) {
                // Product 1: Lavender Breeze (Scented)
                Product lavender = Product.builder()
                    .category(scented)
                    .name("Lavender Breeze")
                    .price(new BigDecimal("18.99"))
                    .description("Calming lavender and chamomile blend designed to melt away everyday stress.")
                    .fragrance("Lavender & Chamomile")
                    .burnTime("40-50 hours")
                    .stock(50)
                    .featured(true)
                    .bestSeller(true)
                    .images(new ArrayList<>())
                    .build();

                // Product 2: Amber Glow (Scented)
                Product amber = Product.builder()
                    .category(scented)
                    .name("Amber Glow")
                    .price(new BigDecimal("22.50"))
                    .description("A warm, earthy scent featuring layers of sweet amber and rich sandalwood.")
                    .fragrance("Warm Amber & Sandalwood")
                    .burnTime("50-60 hours")
                    .stock(35)
                    .featured(true)
                    .bestSeller(false)
                    .images(new ArrayList<>())
                    .build();

                // Product 3: Sculpted Blossom (Decorative)
                Product blossom = Product.builder()
                    .category(decorative)
                    .name("Sculpted Blossom")
                    .price(new BigDecimal("15.00"))
                    .description("Artisan hand-sculpted unscented beeswax candle in the shape of a blooming rose.")
                    .fragrance("Unscented")
                    .burnTime("10-15 hours")
                    .stock(20)
                    .featured(false)
                    .bestSeller(true)
                    .images(new ArrayList<>())
                    .build();

                // Save all products
                productRepository.saveAll(List.of(lavender, amber, blossom));
                logger.info("[SeedData] Products seeded successfully.");
            }
        }
    }
}
