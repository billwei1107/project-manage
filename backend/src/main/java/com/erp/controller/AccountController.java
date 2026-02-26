package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.dto.AuthResponse;
import com.erp.entity.User;
import com.erp.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @file AccountController.java
 * @description 帳號管理控制器 / Account Controller
 * @description_en Rest API for administrating user accounts
 * @description_zh 帳號管理的 Rest API 接口，僅限管理員使用
 */
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuthResponse.UserInfo>>> getAllAccounts() {
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved successfully", accountService.getAllUsers()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> createAccount(@RequestBody User userRequest) {
        // Here we just use the User entity directly as a request payload for simplicity
        // In a real production system, a separate AccountRequest DTO is advised.
        return ResponseEntity
                .ok(ApiResponse.success("Account created successfully", accountService.createUser(userRequest)));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> resetPassword(@PathVariable String id) {
        return ResponseEntity
                .ok(ApiResponse.success("Password reset to default successfully", accountService.resetPassword(id)));
    }
}
