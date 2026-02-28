package com.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @file FinancialRecord.java
 * @description 財務記錄實體 / Financial Record Entity
 * @description_en Represents a single financial transaction (income or expense)
 *                 linked to a project
 * @description_zh 專案收支記錄
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "financial_records")
@EntityListeners(AuditingEntityListener.class)
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String projectId; // Linked project ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinancialType type; // INCOME or EXPENSE

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate transactionDate; // Date of transaction

    @Column
    private String receiptUrl; // URL or path to the uploaded receipt/invoice image

    @Column
    private String createdBy; // User ID who created this record

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
