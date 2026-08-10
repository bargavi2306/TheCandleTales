package com.thecandletales.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    
    @Builder.Default
    private String type = "Bearer";
    
    @Builder.Default
    private long expiresIn = 86400000;
    
    private AdminDto admin;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminDto {
        private Long id;
        private String name;
        private String email;
    }
}
