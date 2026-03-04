package com.erp.controller;

import com.erp.dto.AttendanceResponse;
import com.erp.dto.LeaveRequestDto;
import com.erp.service.HrService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * @file HrController.java
 * @description 人事與資源管理 API 控制器 / HR and Resource Controller
 * @description_en Controller handling employee attendance and leave management
 *                 endpoints
 * @description_zh 負責處理員工打卡、請假與人員名單的控制器
 */
@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
public class HrController {

    private final HrService hrService;

    @PostMapping("/attendance/check-in")
    public ResponseEntity<AttendanceResponse> checkIn(Authentication auth) {
        return ResponseEntity.ok(hrService.checkIn(auth.getName()));
    }

    @PostMapping("/attendance/check-out")
    public ResponseEntity<AttendanceResponse> checkOut(Authentication auth) {
        return ResponseEntity.ok(hrService.checkOut(auth.getName()));
    }

    @GetMapping("/attendance/my")
    public ResponseEntity<List<AttendanceResponse>> getMyMonthlyAttendance(
            Authentication auth,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        LocalDate now = LocalDate.now();
        int queryYear = year != null ? year : now.getYear();
        int queryMonth = month != null ? month : now.getMonthValue();

        return ResponseEntity.ok(hrService.getMyMonthlyAttendance(auth.getName(), queryYear, queryMonth));
    }

    @PostMapping("/leave")
    public ResponseEntity<LeaveRequestDto.Response> applyLeave(
            Authentication auth,
            @Valid @RequestBody LeaveRequestDto.CreateRequest request) {
        return ResponseEntity.ok(hrService.createLeaveRequest(auth.getName(), request));
    }

    @GetMapping("/leave/my")
    public ResponseEntity<List<LeaveRequestDto.Response>> getMyLeaveRequests(Authentication auth) {
        return ResponseEntity.ok(hrService.getMyLeaveRequests(auth.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/leave/pending")
    public ResponseEntity<List<LeaveRequestDto.Response>> getPendingLeaveRequests() {
        return ResponseEntity.ok(hrService.getPendingLeaveRequests());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/leave/{id}/approve")
    public ResponseEntity<LeaveRequestDto.Response> approveLeaveRequest(
            Authentication auth,
            @PathVariable String id,
            @RequestParam boolean isApproved) {
        return ResponseEntity.ok(hrService.processLeaveRequest(id, auth.getName(), isApproved));
    }
}
