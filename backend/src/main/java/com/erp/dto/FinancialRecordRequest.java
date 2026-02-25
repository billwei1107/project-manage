package com.erp.dto;

import com.erp.entity.FinancialCategory;
import com.erp.entity.FinancialType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FinancialRecordRequest {
    private String projectId;
    private FinancialType type;
    private Double amount;
    private FinancialCategory category;
    private String description;
    private LocalDate transactionDate;
    private String createdBy;
    private boolean taxIncluded; // If true, backend will calculate tax
}
