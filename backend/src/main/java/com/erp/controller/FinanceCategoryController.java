package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.entity.FinanceCategory;
import com.erp.entity.FinancialType;
import com.erp.service.FinanceCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance-categories")
@RequiredArgsConstructor
public class FinanceCategoryController {

    private final FinanceCategoryService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinanceCategory>>> getAllCategories(
            @RequestParam(required = false) FinancialType type) {
        List<FinanceCategory> list = (type != null)
                ? service.getCategoriesByType(type)
                : service.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FinanceCategory>> addCategory(@RequestBody FinanceCategory category) {
        return ResponseEntity.ok(ApiResponse.success("Category created", service.addCategory(category)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinanceCategory>> updateCategory(
            @PathVariable String id, @RequestBody FinanceCategory request) {
        return ResponseEntity
                .ok(ApiResponse.success("Category updated", service.updateCategory(id, request.getName())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        service.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
