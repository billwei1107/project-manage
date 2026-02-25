package com.erp.entity;

/**
 * @file FinancialCategory.java
 * @description 財務分類枚舉 / Financial Category Enum
 * @description_en Enum representing categories of financial transactions
 * @description_zh 定義收支分類項目
 */
public enum FinancialCategory {
    // Income Categories
    PROJECT_REVENUE, // 專案款項
    MAINTENANCE_FEE, // 維護費用
    CONSULTING, // 顧問費
    OTHERS_INCOME, // 其他收入

    // Expense Categories
    HOSTING, // 主機/雲端費用
    OUTSOURCING, // 外包成本
    LABOR, // 人力成本
    SOFTWARE, // 軟體授權
    TAX, // 稅務支出
    OFFICE, // 辦公室雜支
    OTHERS_EXPENSE // 其他支出
}
