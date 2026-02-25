package com.erp.service;

import com.erp.entity.FinancialRecord;
import com.erp.entity.FinancialType;
import com.erp.repository.FinancialRepository;
import com.erp.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @file FinancialService.java
 * @description 財務服務層 / Financial Service
 * @description_en Business logic for financial management
 * @description_zh 處理收支記錄、預算計算與統計
 */
@Service
@RequiredArgsConstructor
public class FinancialService {

    private final FinancialRepository financialRepository;
    private final ProjectRepository projectRepository;

    public List<FinancialRecord> getRecordsByProject(String projectId) {
        return financialRepository.findByProjectIdOrderByTransactionDateDesc(projectId);
    }

    @Transactional
    public FinancialRecord addRecord(FinancialRecord record) {
        // Validate project exists
        projectRepository.findById(record.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return financialRepository.save(record);
    }

    @Transactional
    public void deleteRecord(String id) {
        financialRepository.deleteById(id);
    }

    public Map<String, Object> getProjectFinancialSummary(String projectId) {
        List<FinancialRecord> records = financialRepository.findByProjectId(projectId);

        double totalIncome = records.stream()
                .filter(r -> r.getType() == FinancialType.INCOME)
                .mapToDouble(FinancialRecord::getAmount)
                .sum();

        double totalExpense = records.stream()
                .filter(r -> r.getType() == FinancialType.EXPENSE)
                .mapToDouble(FinancialRecord::getAmount)
                .sum();

        // Get Project Budget
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        double budget = project.getBudget();

        double netProfit = totalIncome - totalExpense;
        double burnRate = (budget > 0) ? (totalExpense / budget) * 100 : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("budget", budget);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netProfit", netProfit);
        summary.put("burnRate", burnRate); // Percentage

        return summary;
    }
}
