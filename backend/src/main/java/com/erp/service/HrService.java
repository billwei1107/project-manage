package com.erp.service;

import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

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
        userRepository.findByUsernameOrEmployeeIdOrEmail(emailOrId, emailOrId, emailOrId)
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
                .map(user -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getName() != null ? user.getName() : "Unknown");
                    map.put("email", user.getEmail() != null ? user.getEmail() : "");
                    map.put("role", user.getRole() != null ? user.getRole().name() : "N/A");
                    map.put("isOnline", user.isOnline());
                    map.put("lastLoginAt", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : null);
                    map.put("employeeId", user.getEmployeeId() != null ? user.getEmployeeId() : "");
                    return map;
                })
                .collect(Collectors.toList());
    }

    /**
     * 定期清理過期的在線狀態 (每 3 分鐘執行一次)
     * 若最後活動時間超過 5 分鐘，則視為離線。
     */
    @Scheduled(fixedRate = 180000)
    @Transactional
    public void cleanupOfflineUsers() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
        List<com.erp.entity.User> staleUsers = userRepository.findAll().stream()
                .filter(u -> u.isOnline() && (u.getLastLoginAt() == null || u.getLastLoginAt().isBefore(threshold)))
                .collect(Collectors.toList());

        if (!staleUsers.isEmpty()) {
            staleUsers.forEach(u -> u.setOnline(false));
            userRepository.saveAll(staleUsers);
        }
    }
}
