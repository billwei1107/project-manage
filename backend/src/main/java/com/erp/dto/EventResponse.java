package com.erp.dto;

import com.erp.entity.Event.Priority;
import com.erp.entity.Event.RepeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @file EventResponse.java
 * @description 事件回應 DTO / Event Response DTO
 * @description_en Data Transfer Object for returning event details
 * @description_zh 用於回傳事件詳細資訊的資料傳遞物件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String category;
    private Priority priority;
    private RepeatType repeatType;
    private String creatorId;
    private String creatorName;
}
