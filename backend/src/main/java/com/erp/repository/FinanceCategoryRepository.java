package com.erp.repository;

import com.erp.entity.FinanceCategory;
import com.erp.entity.FinancialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinanceCategoryRepository extends JpaRepository<FinanceCategory, String> {
    List<FinanceCategory> findByType(FinancialType type);

    Optional<FinanceCategory> findByName(String name);
}
