package com.erp.controller;

import com.erp.service.HrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @file HrController.java
 * @description 人事與資源管理 API 控制器 / HR and Resource Controller
 * @description_en Controller handling employee tracking and online status
 * @description_zh 負責處理員工基本在線狀態與心跳封包的控制器
 */
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
public class HrController {

    private final HrService hrService;

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(Authentication auth) {
        if (auth != null && auth.getName() != null) {
            hrService.updateHeartbeat(auth.getName());
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employees")
    public ResponseEntity<List<Map<String, Object>>> getEmployees() {
        return ResponseEntity.ok(hrService.getAllEmployeesBrief());
    }
}
