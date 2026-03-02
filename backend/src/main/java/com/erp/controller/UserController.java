package com.erp.controller;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @file UserController.java
 * @description 使用者控制器 / User Controller
 * @description_en Rest API for user management (e.g., selecting members)
 * @description_zh 使用者管理的 Rest API 接口
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserInfo>> getAllUsers() {
        List<UserInfo> users = userRepository.findAll().stream()
                .map(user -> UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .githubUsername(user.getGithubUsername())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @lombok.Data
    @lombok.Builder
    public static class UserInfo {
        private String id;
        private String name;
        private String email;
        private User.Role role;
        private String githubUsername;
    }
}
