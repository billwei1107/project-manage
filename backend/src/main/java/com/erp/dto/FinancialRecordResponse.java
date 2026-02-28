package com.erp.dto;

import com.erp.entity.FinancialType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @file FinancialRecordResponse.java
 * @description 財務記錄回應 DTO / Financial Record Response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialRecordResponse {
    private String id;
    private String projectId;
    private FinancialType type;
    private Double amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private String receiptUrl;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
