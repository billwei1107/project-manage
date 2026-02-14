package com.erp.dto;

import com.erp.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file TaskRequest.java
 * @description 任務請求 DTO / Task Request DTO
 * @description_en Data Transfer Object for creating/updating a task
 * @description_zh 建立或更新任務的請求資料
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    private String title;
    private TaskStatus status;
    private Integer orderIndex;
    private String projectId;
    private String assigneeId;
    private java.time.LocalDateTime deadline;
    private String description;
}
