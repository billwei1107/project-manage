package com.erp.config;

import com.erp.entity.FinanceCategory;
import com.erp.entity.FinancialType;
import com.erp.repository.FinanceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DbInitializer {

    private final FinanceCategoryRepository categoryRepository;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.saveAll(List.of(
                        FinanceCategory.builder().name("專案款項").type(FinancialType.INCOME).build(),
                        FinanceCategory.builder().name("維護費用").type(FinancialType.INCOME).build(),
                        FinanceCategory.builder().name("顧問費").type(FinancialType.INCOME).build(),
                        FinanceCategory.builder().name("其他收入").type(FinancialType.INCOME).build(),

                        FinanceCategory.builder().name("主機/雲端費用").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("外包成本").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("人力成本").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("軟體授權").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("稅務支出").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("辦公室雜支").type(FinancialType.EXPENSE).build(),
                        FinanceCategory.builder().name("其他支出").type(FinancialType.EXPENSE).build()));
            }
        };
    }
}
