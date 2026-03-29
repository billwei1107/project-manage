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

        @org.springframework.beans.factory.annotation.Value("${app.default-password:ERP@123456}")
        private String defaultPassword;

        public List<AuthResponse.UserInfo> getAllUsers() {
                return userRepository.findAll().stream()
                                .map(user -> AuthResponse.UserInfo.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .username(user.getUsername())
                                                .employeeId(user.getEmployeeId())
                                                .email(user.getEmail())
                                                .githubUsername(user.getGithubUsername())
                                                .role(user.getRole())
                                                .build())
                                .collect(Collectors.toList());
        }

        public AuthResponse.UserInfo createUser(User newUserData) {
                String username = newUserData.getUsername();
                if (username != null && username.trim().isEmpty()) {
                        username = null;
                }

                String email = newUserData.getEmail();
                if (email != null && email.trim().isEmpty()) {
                        email = null;
                }

                String githubUsername = newUserData.getGithubUsername();
                if (githubUsername != null && githubUsername.trim().isEmpty()) {
                        githubUsername = null;
                }

                if (email != null && userRepository.existsByEmail(email)) {
                        throw new RuntimeException("Email already exists");
                }

                String employeeId = newUserData.getEmployeeId();
                if (employeeId == null || employeeId.trim().isEmpty()) {
                        employeeId = generateEmployeeId(newUserData.getRole());
                }

                // Use default password
                String encodedPassword = passwordEncoder.encode(defaultPassword);

                User user = User.builder()
                                .name(newUserData.getName())
                                .username(username)
                                .employeeId(employeeId)
                                .email(email)
                                .role(newUserData.getRole())
                                .password(encodedPassword)
                                .isDefaultPassword(true)
                                .githubUsername(githubUsername)
                                .build();

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .githubUsername(savedUser.getGithubUsername())
                                .role(savedUser.getRole())
                                .build();
        }

        public AuthResponse.UserInfo resetPassword(String userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                user.setPassword(passwordEncoder.encode(defaultPassword));
                user.setDefaultPassword(true);

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .githubUsername(savedUser.getGithubUsername())
                                .role(savedUser.getRole())
                                .build();
        }

        public AuthResponse.UserInfo updateUser(String userId, User updatedData) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

                if (updatedData.getEmail() != null) {
                        if (updatedData.getEmail().trim().isEmpty()) {
                                user.setEmail(null);
                        } else if (!updatedData.getEmail().equals(user.getEmail())) {
                                if (userRepository.existsByEmail(updatedData.getEmail())) {
                                        throw new RuntimeException("Email already exists");
                                }
                                user.setEmail(updatedData.getEmail());
                        }
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

                if (updatedData.getEmployeeId() != null) {
                        if (updatedData.getEmployeeId().trim().isEmpty()) {
                                // Do not allow wiping the employeeId, ignore or self-correct
                        } else {
                                user.setEmployeeId(updatedData.getEmployeeId());
                        }
                }

                if (updatedData.getRole() != null) {
                        user.setRole(updatedData.getRole());
                }

                if (updatedData.getGithubUsername() != null) {
                        if (updatedData.getGithubUsername().trim().isEmpty()) {
                                user.setGithubUsername(null);
                        } else {
                                user.setGithubUsername(updatedData.getGithubUsername());
                        }
                }

                User savedUser = userRepository.save(user);

                return AuthResponse.UserInfo.builder()
                                .id(savedUser.getId())
                                .name(savedUser.getName())
                                .username(savedUser.getUsername())
                                .employeeId(savedUser.getEmployeeId())
                                .email(savedUser.getEmail())
                                .githubUsername(savedUser.getGithubUsername())
                                .role(savedUser.getRole())
                                .build();
        }

        public String generateEmployeeId(User.Role role) {
                String prefix;
                switch (role) {
                        case ADMIN:
                                prefix = "ADM";
                                break;
                        case DEV:
                                prefix = "DEV";
                                break;
                        case PM:
                                prefix = "PM";
                                break;
                        case CLIENT:
                                prefix = "CLI";
                                break;
                        default:
                                prefix = "EMP";
                }

                return userRepository.findTopByEmployeeIdStartingWithOrderByEmployeeIdDesc(prefix)
                                .map(User::getEmployeeId)
                                .map(id -> id.substring(prefix.length())) // Extract numeric part
                                .map(numStr -> {
                                        try {
                                                int currentMax = Integer.parseInt(numStr);
                                                return String.format("%s%03d", prefix, currentMax + 1);
                                        } catch (NumberFormatException e) {
                                                return prefix + "001";
                                        }
                                })
                                .orElse(prefix + "001");
        }
}
