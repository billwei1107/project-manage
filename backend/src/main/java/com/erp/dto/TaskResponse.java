package com.erp.dto;

import com.erp.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @file TaskResponse.java
 * @description 任務回應 DTO / Task Response DTO
 * @description_en Data Transfer Object for task details
 * @description_zh 任務詳細資料回應
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private String id;
    private String title;
    private TaskStatus status;
    private Integer orderIndex;
    private String projectId;
    private AssigneeInfo assignee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AssigneeInfo {
        private String id;
        private String name;
        private String email;
    }
}
