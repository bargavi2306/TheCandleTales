package com.thecandletales.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConnectivityController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/connectivity")
    public ResponseEntity<Map<String, Object>> checkConnectivity() {
        Map<String, Object> response = new HashMap<>();
        response.put("backend", "UP");
        
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                response.put("database", "CONNECTED");
                response.put("databaseName", connection.getCatalog());
            } else {
                response.put("database", "DISCONNECTED");
            }
        } catch (Exception e) {
            response.put("database", "ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
