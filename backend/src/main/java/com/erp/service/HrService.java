package com.erp.service;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @file HrService.java
 * @description 人事與資源管理業務邏輯 / HR and Resource Management Service
 * @description_en Handles business logic for employee tracking, online status
 * @description_zh 處理員工在線狀態與最後登入紀錄。移除舊有打卡與請假邏輯。
 */
@Service
@RequiredArgsConstructor
public class HrService {

    private final UserRepository userRepository;

    /**
     * 更新使用者活動心跳 (Update user heartbeat)
     * 並標記為在線上
     */
    @Transactional
    public void updateHeartbeat(String emailOrId) {
        userRepository.findByEmail(emailOrId)
                .or(() -> userRepository.findById(emailOrId))
                .ifPresent(user -> {
                    user.setOnline(true);
                    user.setLastLoginAt(LocalDateTime.now());
                    userRepository.save(user);
                });
    }

    /**
     * 獲取所有員工狀態與簡述
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllEmployeesBrief() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() != User.Role.CLIENT)
                .map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "isOnline", user.isOnline(),
                        "lastLoginAt", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : null,
                        "employeeId", user.getEmployeeId() != null ? user.getEmployeeId() : ""))
                .collect(Collectors.toList());
    }
}
