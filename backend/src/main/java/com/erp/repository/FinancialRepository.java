package com.erp.repository;

import com.erp.entity.FinancialRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @file FinancialRepository.java
 * @description 財務記錄資料庫存取層 / Financial Record Repository
 * @description_en Data access layer for financial records
 * @description_zh 提供財務記錄的 CRUD 操作
 */
@Repository
public interface FinancialRepository extends JpaRepository<FinancialRecord, String> {
    List<FinancialRecord> findByProjectId(String projectId);

    List<FinancialRecord> findByProjectIdOrderByTransactionDateDesc(String projectId);
}
