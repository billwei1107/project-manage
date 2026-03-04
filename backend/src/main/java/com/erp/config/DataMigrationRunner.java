package com.erp.config;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import com.erp.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @file DataMigrationRunner.java
 * @description 系統啟動時的資料遷移程式 / Data Migration Runner on Startup
 * @description_en Automatically migrates legacy or missing employee IDs to the
 *                 new role-based format.
 * @description_zh 負責於系統啟動時，盤點並修正舊有帳戶的空白或舊版員工編號 (EMP-)。
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataMigrationRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountService accountService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting Data Migration Runner to fix legacy Employee IDs...");
        List<User> users = userRepository.findAll();
        int migratedCount = 0;

        for (User user : users) {
            String employeeId = user.getEmployeeId();
            // 檢查是否為舊版格式 (例如 EMP-0001)、純字串 EMP 或者為預設空值
            if (employeeId == null || employeeId.trim().isEmpty() || employeeId.startsWith("EMP-")
                    || employeeId.equals("EMP")) {
                String newId = accountService.generateEmployeeId(user.getRole());
                user.setEmployeeId(newId);
                userRepository.save(user);
                migratedCount++;
                log.info("Migrated User '{}' from old ID '{}' to new ID '{}'", user.getUsername(), employeeId, newId);
            }
        }

        log.info("Data Migration completed. Migrated {} legacy users.", migratedCount);
    }
}
