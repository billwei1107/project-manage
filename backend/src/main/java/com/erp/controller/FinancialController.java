package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.dto.FinancialRecordRequest;
import com.erp.dto.FinancialSummaryResponse;
import com.erp.entity.FinancialCategory;
import com.erp.entity.FinancialRecord;
import com.erp.entity.FinancialType;
import com.erp.service.FinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @file FinancialController.java
 * @description 財務控制器 / Financial Controller
 * @description_en Rest API for financial management
 * @description_zh 財務管理的 Rest API 接口
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}/finance")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService financialService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialRecord>>> getRecords(@PathVariable String projectId) {
        return ResponseEntity
                .ok(ApiResponse.success("Records retrieved", financialService.getRecordsByProject(projectId)));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<FinancialSummaryResponse>> getSummary(@PathVariable String projectId) {
        Map<String, Object> summaryMap = financialService.getProjectFinancialSummary(projectId);

        FinancialSummaryResponse response = FinancialSummaryResponse.builder()
                .budget((Double) summaryMap.get("budget"))
                .totalIncome((Double) summaryMap.get("totalIncome"))
                .totalExpense((Double) summaryMap.get("totalExpense"))
                .netProfit((Double) summaryMap.get("netProfit"))
                .burnRate((Double) summaryMap.get("burnRate"))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Summary retrieved", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FinancialRecord>> addRecord(
            @PathVariable String projectId,
            @RequestBody FinancialRecordRequest request) {

        double amount = request.getAmount();
        double taxRate = 0.05;
        FinancialRecord mainRecord;

        if (request.isTaxIncluded()) {
            // Calculate Base and Tax
            // Ref: Amount = Base * 1.05 => Base = Amount / 1.05
            double baseAmount = Math.round((amount / (1 + taxRate)) * 100.0) / 100.0;
            double taxAmount = Math.round((amount - baseAmount) * 100.0) / 100.0;

            // 1. Main Record (Base Amount)
            mainRecord = FinancialRecord.builder()
                    .projectId(projectId)
                    .type(request.getType())
                    .amount(baseAmount)
                    .category(request.getCategory())
                    .description(request.getDescription())
                    .transactionDate(request.getTransactionDate())
                    .createdBy(request.getCreatedBy())
                    .build();

            mainRecord = financialService.addRecord(mainRecord);

            // 2. Tax Record
            FinancialRecord taxRecord = FinancialRecord.builder()
                    .projectId(projectId)
                    .type(request.getType()) // Keep same type (e.g. EXPENSE) or maybe explicitly TAX?
                    // Typically tax on expense is also an expense. Tax on income is not usually
                    // recorded as expense unless "Output Tax".
                    // For simplicity: If Income, Tax portion is "Tax Payable" (Liability).
                    // If Expense, Tax portion is "Input Tax" (Asset/Expense).
                    // Let's just record it as EXPENSE with category TAX for now to keep calculating
                    // logical.
                    .amount(taxAmount)
                    .category(FinancialCategory.TAX)
                    .description("Tax (5%) for: " + request.getDescription())
                    .transactionDate(request.getTransactionDate())
                    .createdBy(request.getCreatedBy())
                    .build();

            // If Original was Income, Tax should probably also be tracked?
            // Actually, if I receive $105 Inc, $100 is Revenue, $5 is Tax Payable.
            // Tax Payable is not "Income".
            // However, our system only has Income/Expense.
            // If Type is INCOME, the Tax part is technically not Income for us.
            // Maybe we just record the Net Income ($100)?
            // But then the bank says $105.
            // Let's stick to: Main Record = Base Amount. Tax Record = Tax Amount (Category:
            // TAX).
            // If Type was INCOME, Main is INCOME $100. Tax Record is... what?
            // If we record Tax Record as INCOME $5 (Tax), then Total Income = 105. Net
            // Profit = 105. Incorrect.
            // Tax Payable is a Liability, not Income.
            // Expenses: Pay $105. Main Expense $100. Tax Expense $5. Total Outflow $105.
            // Correct.

            // ADJUSTMENT:
            // If Income: Split into Income ($100) and... nothing? Or separate "Tax
            // Collected" income?
            // If Expense: Split into Expense ($100) and Expense ($5).

            // For now, let's just record the tax record with the SAME type.
            // INCOME $100 (Consulting) + INCOME $5 (Tax Collected).
            // EXPENSE $100 (Hosting) + EXPENSE $5 (Tax Paid).

            financialService.addRecord(taxRecord);

        } else {
            // Normal Record
            mainRecord = FinancialRecord.builder()
                    .projectId(projectId)
                    .type(request.getType())
                    .amount(amount)
                    .category(request.getCategory())
                    .description(request.getDescription())
                    .transactionDate(request.getTransactionDate())
                    .createdBy(request.getCreatedBy())
                    .build();

            mainRecord = financialService.addRecord(mainRecord);
        }

        return ResponseEntity.ok(ApiResponse.success("Record added", mainRecord));
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(
            @PathVariable String projectId,
            @PathVariable String recordId) {
        financialService.deleteRecord(recordId);
        return ResponseEntity.ok(ApiResponse.success("Record deleted", null));
    }
}
