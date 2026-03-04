package com.erp.dto;

import com.erp.entity.LeaveRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @file LeaveRequestDto.java
 * @description 請假申請/回應 DTO / Leave Request Request/Response DTO
 * @description_en DTO used for creating and returning leave request data
 * @description_zh 用於建立請假單請求與回應的 DTO
 */
public class LeaveRequestDto {

    @Data
    public static class CreateRequest {
        @NotNull(message = "Leave type is required")
        private LeaveRequest.LeaveType leaveType;

        @NotNull(message = "Start date is required")
        private LocalDateTime startDate;

        @NotNull(message = "End date is required")
        private LocalDateTime endDate;

        @NotBlank(message = "Reason is required")
        private String reason;
    }

    @Data
    public static class Response {
        private String id;
        private String userId;
        private String employeeName;
        private LeaveRequest.LeaveType leaveType;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String reason;
        private LeaveRequest.Status status;
        private String approverId;
        private String approverName;
        private LocalDateTime createdAt;

        public static Response fromEntity(LeaveRequest leave) {
            Response response = new Response();
            response.setId(leave.getId());
            response.setUserId(leave.getUser().getId());
            response.setEmployeeName(leave.getUser().getName());
            response.setLeaveType(leave.getLeaveType());
            response.setStartDate(leave.getStartDate());
            response.setEndDate(leave.getEndDate());
            response.setReason(leave.getReason());
            response.setStatus(leave.getStatus());
            response.setCreatedAt(leave.getCreatedAt());

            if (leave.getApprover() != null) {
                response.setApproverId(leave.getApprover().getId());
                response.setApproverName(leave.getApprover().getName());
            }

            return response;
        }
    }
}
