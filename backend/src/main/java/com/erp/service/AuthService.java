package com.erp.service;

import com.erp.config.security.JwtService;
import com.erp.dto.AuthRequest;
import com.erp.dto.AuthResponse;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @file AuthService.java
 * @description 認證服務 / Auth Service
 * @description_en Handles registration and login logic
 * @description_zh 處理註冊與登入邏輯
 */
@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(AuthRequest request) {
                // For demo purposes, creating a default ADMIN user if not exists
                // In real app, registration logic would be more complex
                var user = User.builder()
                                .name("New User")
                                .email(request.getLoginId())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(User.Role.ADMIN)
                                .build();

                userRepository.save(user);
                var userDetails = new com.erp.config.UserAdapter(user);
                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .user(AuthResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .username(user.getUsername())
                                                .employeeId(user.getEmployeeId())
                                                .email(user.getEmail())
                                                .role(user.getRole())
                                                .build())
                                .build();
        }

        public AuthResponse authenticate(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getLoginId(),
                                                request.getPassword()));

                var user = userRepository
                                .findByUsernameOrEmployeeIdOrEmail(request.getLoginId(), request.getLoginId(),
                                                request.getLoginId())
                                .orElseThrow();

                var userDetails = new com.erp.config.UserAdapter(user);
                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .user(AuthResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .username(user.getUsername())
                                                .employeeId(user.getEmployeeId())
                                                .email(user.getEmail())
                                                .role(user.getRole())
                                                .build())
                                .build();
        }

        public AuthResponse.UserInfo getCurrentUser() {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                                authentication.getPrincipal().equals("anonymousUser")) {
                        return null;
                }

                String loginId = authentication.getName();
                var user = userRepository.findByUsernameOrEmployeeIdOrEmail(loginId, loginId, loginId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return AuthResponse.UserInfo.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .username(user.getUsername())
                                .employeeId(user.getEmployeeId())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();
        }
}
