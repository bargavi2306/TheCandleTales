package com.thecandletales.backend.service;

import com.thecandletales.backend.dto.LoginRequest;
import com.thecandletales.backend.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
