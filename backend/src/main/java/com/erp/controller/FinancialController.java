package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.dto.FinancialRecordRequest;
import com.erp.dto.FinancialRecordResponse;
import com.erp.dto.FinancialSummaryResponse;
import com.erp.service.FinancialService;
import com.erp.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Map;

/**
 * @file FinancialController.java
 * @description 財務控制器 / Financial Controller
 */
@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService financialService;
    private final FileUploadService fileUploadService;

    @PostMapping("/receipts")
    public ResponseEntity<ApiResponse<String>> uploadReceipt(@RequestParam("file") MultipartFile file) {
        String fileName = fileUploadService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/finance/receipts/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(ApiResponse.success("Receipt uploaded successfully", fileDownloadUri));
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<List<FinancialRecordResponse>>> getRecordsByProject(
            @PathVariable String projectId) {
        return ResponseEntity
                .ok(ApiResponse.success("Records retrieved", financialService.getRecordsByProject(projectId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialRecordResponse>>> getAllRecords() {
        return ResponseEntity.ok(ApiResponse.success("Records retrieved", financialService.getAllRecords()));
    }

    @GetMapping("/projects/{projectId}/summary")
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
    public ResponseEntity<ApiResponse<FinancialRecordResponse>> addRecord(@RequestBody FinancialRecordRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Record added", financialService.addRecord(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialRecordResponse>> updateRecord(
            @PathVariable String id,
            @RequestBody FinancialRecordRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Record updated", financialService.updateRecord(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable String id) {
        financialService.deleteRecord(id);
        return ResponseEntity.ok(ApiResponse.success("Record deleted", null));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportToCsv(@RequestParam(required = false) String projectId) {
        byte[] csvData = financialService.exportToCsv(projectId);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=financial_report.csv");
        headers.set(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @PostMapping("/import/csv")
    public ResponseEntity<ApiResponse<Integer>> importFromCsv(
            @RequestParam("file") MultipartFile file,
            @RequestParam String projectId) {
        int importedCount = financialService.importFromCsv(file, projectId);
        return ResponseEntity
                .ok(ApiResponse.success("Successfully imported " + importedCount + " records", importedCount));
    }
}
