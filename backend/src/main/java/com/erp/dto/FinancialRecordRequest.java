package com.erp.dto;

import com.erp.entity.FinancialType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FinancialRecordRequest {
    private String projectId;
    private FinancialType type;
    private Double amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private String createdBy;
    private boolean taxIncluded; // If true, backend will calculate tax
    private Double taxRate; // Optional, defaults to 5 if not provided
}
