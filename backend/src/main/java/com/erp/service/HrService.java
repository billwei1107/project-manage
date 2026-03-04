package com.erp.service;

import com.erp.dto.AttendanceResponse;
import com.erp.dto.LeaveRequestDto;
import com.erp.entity.Attendance;
import com.erp.entity.LeaveRequest;
import com.erp.entity.User;
import com.erp.repository.AttendanceRepository;
import com.erp.repository.LeaveRequestRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @file HrService.java
 * @description 人事與資源管理業務邏輯 / HR and Resource Management Service
 * @description_en Handles business logic for clock-ins, leave requests, and
 *                 working hours
 * @description_zh 處理員工打卡、請假簽核與工時計算的服務層
 */
@Service
@RequiredArgsConstructor
public class HrService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    /**
     * 上班打卡 (Check-In)
     */
    @Transactional
    public AttendanceResponse checkIn(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        if (attendanceRepository.findByUserIdAndWorkDate(userId, today).isPresent()) {
            throw new RuntimeException("Already checked in today.");
        }

        LocalDateTime now = LocalDateTime.now();
        Attendance.Status status = Attendance.Status.PRESENT;

        // 簡單遲到判定：若超過早上 9:15 算遲到 (可依實際需求調整)
        if (now.toLocalTime().isAfter(java.time.LocalTime.of(9, 15))) {
            status = Attendance.Status.LATE;
        }

        Attendance attendance = Attendance.builder()
                .user(user)
                .workDate(today)
                .checkInTime(now)
                .status(status)
                .build();

        attendanceRepository.save(attendance);
        return AttendanceResponse.fromEntity(attendance);
    }

    /**
     * 下班打卡 (Check-Out)
     */
    @Transactional
    public AttendanceResponse checkOut(String userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndWorkDate(userId, today)
                .orElseThrow(() -> new RuntimeException("No check-in record found for today."));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out today.");
        }

        LocalDateTime now = LocalDateTime.now();
        attendance.setCheckOutTime(now);

        // 計算工時 (單位: 小時，保留小數)
        Duration duration = Duration.between(attendance.getCheckInTime(), now);
        double hours = duration.toMinutes() / 60.0;
        attendance.setWorkHours(Math.round(hours * 100.0) / 100.0);

        attendanceRepository.save(attendance);
        return AttendanceResponse.fromEntity(attendance);
    }

    /**
     * 獲取員工當月出勤紀錄 (Get My Monthly Attendance)
     */
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyMonthlyAttendance(String userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return attendanceRepository.findByUserIdAndWorkDateBetweenOrderByWorkDateDesc(userId, startDate, endDate)
                .stream()
                .map(AttendanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 申請請假 (Apply for Leave)
     */
    @Transactional
    public LeaveRequestDto.Response createLeaveRequest(String userId, LeaveRequestDto.CreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .user(user)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .build();

        leaveRequestRepository.save(leaveRequest);
        return LeaveRequestDto.Response.fromEntity(leaveRequest);
    }

    /**
     * 獲取我的請假紀錄 (Get My Leave Requests)
     */
    @Transactional(readOnly = true)
    public List<LeaveRequestDto.Response> getMyLeaveRequests(String userId) {
        return leaveRequestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(LeaveRequestDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 獲取待簽核請假名單 (Get Pending Leave Requests - For Admin/HR)
     */
    @Transactional(readOnly = true)
    public List<LeaveRequestDto.Response> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatusOrderByCreatedAtAsc(LeaveRequest.Status.PENDING)
                .stream()
                .map(LeaveRequestDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 簽核請假申請 (Approve/Reject Leave Request)
     */
    @Transactional
    public LeaveRequestDto.Response processLeaveRequest(String requestId, String approverId, boolean isApproved) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (leaveRequest.getStatus() != LeaveRequest.Status.PENDING) {
            throw new RuntimeException("Leave request is already processed.");
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        leaveRequest.setStatus(isApproved ? LeaveRequest.Status.APPROVED : LeaveRequest.Status.REJECTED);
        leaveRequest.setApprover(approver);

        leaveRequestRepository.save(leaveRequest);
        return LeaveRequestDto.Response.fromEntity(leaveRequest);
    }
}
