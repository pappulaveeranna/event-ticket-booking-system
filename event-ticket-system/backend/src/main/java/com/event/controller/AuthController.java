package com.event.controller;

import com.event.model.User;
import com.event.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String roleStr = request.getOrDefault("role", "USER");
            String fullName = request.get("fullName");
            String phoneNumber = request.get("phoneNumber");
            String address = request.get("address");
            
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            User user = userService.register(email, password, role, fullName, phoneNumber, address);
            
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "userId", user.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            String token = userService.login(email, password);
            User user = userService.getUserByEmail(email);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email,
                "role", user.getRole().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}