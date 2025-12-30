package com.event.service;

import com.event.model.User;
import com.event.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    public User register(String email, String password, User.Role role, String fullName, String phoneNumber, String address) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(email, passwordEncoder.encode(password), role, fullName, phoneNumber, address);
        return userRepository.save(user);
    }
    
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);
        
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        return jwtService.generateToken(email, user.getRole().name());
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}