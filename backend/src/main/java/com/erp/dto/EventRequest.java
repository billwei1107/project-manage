package com.erp.dto;

import com.erp.entity.Event.Priority;
import com.erp.entity.Event.RepeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @file EventRequest.java
 * @description 事件請求 DTO / Event Request DTO
 * @description_en Data Transfer Object for creating or updating an event
 * @description_zh 用於建立或更新事件的資料傳遞物件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String category;
    private Priority priority;
    private RepeatType repeatType;
}
