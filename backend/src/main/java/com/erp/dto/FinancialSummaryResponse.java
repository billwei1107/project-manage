package com.erp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FinancialSummaryResponse {
    private Double budget;
    private Double totalIncome;
    private Double totalExpense;
    private Double netProfit;
    private Double burnRate; // Percentage
}
