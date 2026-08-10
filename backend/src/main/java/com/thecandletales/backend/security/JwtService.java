package com.thecandletales.backend.security;

import com.thecandletales.backend.entity.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Autowired
    private Environment environment;

    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    @PostConstruct
    public void init() {
        boolean isTest = Arrays.asList(environment.getActiveProfiles()).contains("test");
        String secretEnv = System.getenv("JWT_SECRET");
        if (secretEnv == null || secretEnv.trim().isEmpty()) {
            if (isTest) {
                this.secret = "dummy_secret_for_tests_must_be_long_enough_to_satisfy_hmac_sha_key_for";
                return;
            }
            throw new IllegalStateException("JWT Secret configuration error: " +
                    "Missing required environment variable. Please ensure JWT_SECRET is correctly configured in the environment.");
        }
        this.secret = secretEnv;
    }

    private Key getSigningKey() {
        byte[] keyBytes = this.secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(Admin admin) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", admin.getId());
        claims.put("name", admin.getName());
        claims.put("email", admin.getEmail());
        return generateToken(claims, admin.getEmail());
    }

    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String expectedUsername) {
        final String username = extractUsername(token);
        return (username.equals(expectedUsername)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
