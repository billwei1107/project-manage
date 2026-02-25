package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file FinanceCategory.java
 * @description 財務分類實體 / Finance Category Entity
 * @description_en User-defined categories for financial records
 * @description_zh 用戶自定義的收支分類
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "finance_categories")
public class FinanceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinancialType type; // INCOME or EXPENSE
}
