package com.erp.service;

import com.erp.dto.FinancialRecordRequest;
import com.erp.dto.FinancialRecordResponse;
import com.erp.entity.FinancialRecord;
import com.erp.entity.FinancialType;
import com.erp.entity.User;
import com.erp.repository.FinancialRepository;
import com.erp.repository.ProjectRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @file FinancialService.java
 * @description 財務服務層 / Financial Service
 * @description_en Business logic for financial management
 * @description_zh 處理收支記錄、預算計算與統計
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FinancialService {

    private final FinancialRepository financialRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<FinancialRecordResponse> getRecordsByProject(String projectId) {
        return financialRepository.findByProjectIdOrderByTransactionDateDesc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FinancialRecordResponse> getAllRecords() {
        return financialRepository.findAllByOrderByTransactionDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FinancialRecordResponse addRecord(FinancialRecordRequest request) {
        // Validate project exists
        projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found: " + request.getProjectId()));

        User currentUser = getCurrentUser();

        Double finalAmount = request.getAmount();
        if (request.isTaxIncluded() && finalAmount != null) {
            double rate = request.getTaxRate() != null ? request.getTaxRate() : 5.0;
            finalAmount = finalAmount * (1 + (rate / 100));
        }

        FinancialRecord record = FinancialRecord.builder()
                .projectId(request.getProjectId())
                .type(request.getType())
                .amount(finalAmount)
                .category(request.getCategory())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .receiptUrl(request.getReceiptUrl())
                .createdBy(currentUser.getId())
                .build();

        FinancialRecord savedRecord = financialRepository.save(record);
        return mapToResponse(savedRecord);
    }

    public FinancialRecordResponse updateRecord(String id, FinancialRecordRequest request) {
        FinancialRecord record = financialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial record not found: " + id));

        Double finalAmount = request.getAmount() != null ? request.getAmount() : record.getAmount();
        if (request.isTaxIncluded() && request.getAmount() != null) {
            double rate = request.getTaxRate() != null ? request.getTaxRate() : 5.0;
            finalAmount = finalAmount * (1 + (rate / 100));
        }

        if (finalAmount != null) {
            record.setAmount(finalAmount);
        }
        if (request.getProjectId() != null) {
            record.setProjectId(request.getProjectId());
        }
        if (request.getType() != null) {
            record.setType(request.getType());
        }
        if (request.getCategory() != null) {
            record.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            record.setDescription(request.getDescription());
        }
        if (request.getTransactionDate() != null) {
            record.setTransactionDate(request.getTransactionDate());
        }
        if (request.getReceiptUrl() != null) {
            record.setReceiptUrl(request.getReceiptUrl());
        }

        FinancialRecord updatedRecord = financialRepository.save(record);
        return mapToResponse(updatedRecord);
    }

    public void deleteRecord(String id) {
        financialRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
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

        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        double budget = project.getBudget() != null ? project.getBudget() : 0;

        double netProfit = totalIncome - totalExpense;
        double burnRate = (budget > 0) ? (totalExpense / budget) * 100 : 0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("budget", budget);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netProfit", netProfit);
        summary.put("burnRate", burnRate);

        return summary;
    }

    private FinancialRecordResponse mapToResponse(FinancialRecord record) {
        return FinancialRecordResponse.builder()
                .id(record.getId())
                .projectId(record.getProjectId())
                .type(record.getType())
                .amount(record.getAmount())
                .category(record.getCategory())
                .description(record.getDescription())
                .transactionDate(record.getTransactionDate())
                .receiptUrl(record.getReceiptUrl())
                .createdBy(record.getCreatedBy())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }

    public byte[] exportToCsv(String projectId) {
        List<FinancialRecord> records;
        if (projectId != null && !projectId.isEmpty()) {
            records = financialRepository.findByProjectIdOrderByTransactionDateDesc(projectId);
        } else {
            records = financialRepository.findAllByOrderByTransactionDateDesc();
        }

        StringBuilder csvBuilder = new StringBuilder();
        // CSV Header
        csvBuilder.append("ID,Project_ID,Type,Amount,Category,Transaction_Date,Description,Created_By,Created_At\n");

        for (FinancialRecord record : records) {
            csvBuilder.append(escapeCsv(record.getId())).append(",")
                    .append(escapeCsv(record.getProjectId())).append(",")
                    .append(record.getType() != null ? record.getType().name() : "").append(",")
                    .append(record.getAmount()).append(",")
                    .append(escapeCsv(record.getCategory())).append(",")
                    .append(record.getTransactionDate() != null ? record.getTransactionDate().toString() : "")
                    .append(",")
                    .append(escapeCsv(record.getDescription())).append(",")
                    .append(escapeCsv(record.getCreatedBy())).append(",")
                    .append(record.getCreatedAt() != null ? record.getCreatedAt().toString() : "")
                    .append("\n");
        }

        return csvBuilder.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\n") || escaped.contains("\"")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    @Transactional
    public int importFromCsv(MultipartFile file, String projectId) {
        int count = 0;
        try (java.io.BufferedReader br = new java.io.BufferedReader(
                new java.io.InputStreamReader(file.getInputStream(), java.nio.charset.StandardCharsets.UTF_8))) {

            String line;
            boolean isFirstLine = true;
            User currentUser = getCurrentUser();

            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }

                // Simple CSV split (Note: does not perfectly handle commas inside quotes, but
                // fine for basic templates)
                // A better approach for a real ERP is using OpenCSV/CommonsCSV
                String[] values = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
                if (values.length < 5)
                    continue; // Skip malformed lines

                try {
                    String typeStr = values[2].replace("\"", "").trim();
                    FinancialType type = FinancialType.valueOf(typeStr.toUpperCase());
                    Double amount = Double.parseDouble(values[3].replace("\"", "").trim());
                    String category = values[4].replace("\"", "").trim();

                    java.time.LocalDate transactionDate = java.time.LocalDate.now();
                    if (values.length > 5 && !values[5].isEmpty()) {
                        transactionDate = java.time.LocalDate.parse(values[5].replace("\"", "").trim());
                    }

                    String description = "";
                    if (values.length > 6) {
                        description = values[6].replace("\"", "").trim();
                    }

                    FinancialRecord record = FinancialRecord.builder()
                            .projectId(projectId)
                            .type(type)
                            .amount(amount)
                            .category(category)
                            .transactionDate(transactionDate)
                            .description(description)
                            .createdBy(currentUser.getId())
                            .build();

                    financialRepository.save(record);
                    count++;
                } catch (Exception e) {
                    log.warn("Failed to parse CSV line: {}", line, e);
                    // Continue to next line
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file", e);
        }
        return count;
    }

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized");
        }
        String loginId = authentication.getName();
        return userRepository.findByUsernameOrEmployeeIdOrEmail(loginId, loginId, loginId)
                .orElseThrow(() -> new RuntimeException("User not found: " + loginId));
    }
}
