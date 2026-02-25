package com.erp.service;

import com.erp.entity.FinanceCategory;
import com.erp.entity.FinancialType;
import com.erp.repository.FinanceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceCategoryService {

    private final FinanceCategoryRepository repository;

    public List<FinanceCategory> getAllCategories() {
        return repository.findAll();
    }

    public List<FinanceCategory> getCategoriesByType(FinancialType type) {
        return repository.findByType(type);
    }

    @Transactional
    public FinanceCategory addCategory(FinanceCategory category) {
        if (repository.findByName(category.getName()).isPresent()) {
            throw new RuntimeException("Category name already exists");
        }
        return repository.save(category);
    }

    @Transactional
    public FinanceCategory updateCategory(String id, String newName) {
        FinanceCategory cat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        // Check duplicate
        repository.findByName(newName).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Category name already exists");
            }
        });
        cat.setName(newName);
        return repository.save(cat);
    }

    @Transactional
    public void deleteCategory(String id) {
        // Technically we should check if records are using this category before
        // deleting.
        // Or safely allow deletion and old records just keep the string. We will allow
        // simple deletion.
        repository.deleteById(id);
    }
}
