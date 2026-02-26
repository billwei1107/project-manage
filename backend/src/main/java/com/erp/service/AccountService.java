package com.erp.service;

import com.erp.dto.AuthResponse;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @file AccountService.java
 * @description 帳號管理服務 / Account Service
 * @description_en Service for managing user accounts (Admin only)
 * @description_zh 處理帳號建立、列表與密碼重設等管理操作
 */
@Service
@RequiredArgsConstructor
public class AccountService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        // TODO: Define better in application properties or constants
        private static final String DEFAULT_PASSWORD = "ERP@123456";

        public List<AuthResponse.UserInfo> getAllUsers() {
                return userRepository.findAll().stream()
                                .map(user -> AuthResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .username(user.getUsername())
                                                .employeeId(user.getEmployeeId())
                                                .email(user.getEmail())
                                                .role(user.getRole())
                                                .build())
                                .collect(Collectors.toList());
        }

        public AuthResponse.UserInfo createUser(User newUserData) {
                if (newUserData.getEmail() != null && userRepository.existsByEmail(newUserData.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                String username = newUserData.getUsername();
                if (username != null && username.trim().isEmpty()) {
                        username = null;
                }

                String employeeId = newUserData.getEmployeeId();
                if (employeeId == null || employeeId.trim().isEmpty()) {
                        // Auto-generate employee ID
                        long nextId = userRepository.count() + 1;
                        employeeId = String.format("EMP-%04d", nextId);
                }

                // Use default password
                String encodedPassword = passwordEncoder.encode(DEFAULT_PASSWORD);

                User user = User.builder()
                                .name(newUserData.getName())
                                .username(username)
                                .employeeId(employeeId)
                                .email(newUserData.getEmail())
                                .role(newUserData.getRole())
                                .password(encodedPassword)
                                .isDefaultPassword(true)
                                .build();

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .role(savedUser.getRole())
                                .build();
        }

        public AuthResponse.UserInfo resetPassword(String userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
                user.setDefaultPassword(true);

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .role(savedUser.getRole())
                                .build();
        }

        public AuthResponse.UserInfo updateUser(String userId, User updatedData) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                if (updatedData.getEmail() != null && !updatedData.getEmail().equals(user.getEmail())) {
                        if (userRepository.existsByEmail(updatedData.getEmail())) {
                                throw new RuntimeException("Email already exists");
                        }
                        user.setEmail(updatedData.getEmail());
                }

                if (updatedData.getName() != null && !updatedData.getName().trim().isEmpty()) {
                        user.setName(updatedData.getName());
                }

                if (updatedData.getUsername() != null) {
                        if (updatedData.getUsername().trim().isEmpty()) {
                                user.setUsername(null);
                        } else {
                                user.setUsername(updatedData.getUsername());
                        }
                }

                if (updatedData.getEmployeeId() != null && !updatedData.getEmployeeId().trim().isEmpty()) {
                        user.setEmployeeId(updatedData.getEmployeeId());
                }

                if (updatedData.getRole() != null) {
                        user.setRole(updatedData.getRole());
                }

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .role(savedUser.getRole())
                                .build();
        }
}
