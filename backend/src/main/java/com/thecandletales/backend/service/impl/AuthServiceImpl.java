package com.thecandletales.backend.service.impl;

import com.thecandletales.backend.dto.LoginRequest;
import com.thecandletales.backend.dto.LoginResponse;
import com.thecandletales.backend.entity.Admin;
import com.thecandletales.backend.repository.AdminRepository;
import com.thecandletales.backend.security.JwtService;
import com.thecandletales.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new com.thecandletales.backend.exception.InvalidCredentialsException("Invalid email or password.");
        }

        // Fetch Admin
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.thecandletales.backend.exception.InvalidCredentialsException("Invalid email or password."));

        // Generate Token
        String token = jwtService.generateToken(admin);

        // Build Response
        return LoginResponse.builder()
                .token(token)
                .admin(LoginResponse.AdminDto.builder()
                        .id(admin.getId())
                        .name(admin.getName())
                        .email(admin.getEmail())
                        .build())
                .build();
    }
}
