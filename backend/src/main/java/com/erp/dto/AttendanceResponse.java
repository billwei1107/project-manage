package com.erp.dto;

import com.erp.entity.Attendance;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @file AttendanceResponse.java
 * @description 打卡紀錄回應 DTO / Attendance Response DTO
 * @description_en Data Transfer Object for attendance records sent to clients
 * @description_zh 回傳給客戶端的員工打卡紀錄 DTO
 */
@Data
@Builder
public class AttendanceResponse {
    private String id;
    private String userId;
    private String employeeName;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private LocalDate workDate;
    private Attendance.Status status;
    private Double workHours;

    public static AttendanceResponse fromEntity(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .userId(attendance.getUser().getId())
                .employeeName(attendance.getUser().getName())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .workDate(attendance.getWorkDate())
                .status(attendance.getStatus())
                .workHours(attendance.getWorkHours())
                .build();
    }
}
