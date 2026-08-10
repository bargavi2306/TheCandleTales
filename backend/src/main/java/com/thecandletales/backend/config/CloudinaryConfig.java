package com.thecandletales.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Autowired
    private Environment environment;

    @Bean
    public Cloudinary cloudinary() {
        boolean isTest = Arrays.asList(environment.getActiveProfiles()).contains("test");

        String cloudName = System.getenv("CLOUDINARY_CLOUD_NAME");
        String apiKey = System.getenv("CLOUDINARY_API_KEY");
        String apiSecret = System.getenv("CLOUDINARY_API_SECRET");

        if (isTest) {
            Map<String, String> dummyConfig = new HashMap<>();
            dummyConfig.put("cloud_name", cloudName != null ? cloudName : "dummy");
            dummyConfig.put("api_key", apiKey != null ? apiKey : "dummy");
            dummyConfig.put("api_secret", apiSecret != null ? apiSecret : "dummy");
            return new Cloudinary(dummyConfig);
        }

        if (cloudName == null || cloudName.trim().isEmpty() ||
            apiKey == null || apiKey.trim().isEmpty() ||
            apiSecret == null || apiSecret.trim().isEmpty()) {
            throw new IllegalStateException("Cloudinary configuration error: " +
                    "Missing required environment variables. Please ensure CLOUDINARY_CLOUD_NAME, " +
                    "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are correctly configured in the environment.");
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);

        return new Cloudinary(config);
    }
}
