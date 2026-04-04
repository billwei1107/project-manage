package com.erp.config;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * @file DataSeeder.java
 * @description Database Seeder
 * @description_en Seeds initial data (e.g., admin user) if database is empty
 * @description_zh 若資料庫為空，則自動產生預設資料 (如管理員帳號)
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 暫時強制綁定密碼為 password 以排除遠端 .env 干擾
    private String adminPassword = "password";

    @Override
    public void run(String... args) throws Exception {
        var adminOpt = userRepository.findByEmail("admin@erp.com");

        if (adminOpt.isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .username("admin")
                    .email("admin@erp.com")
                    .password(passwordEncoder.encode(adminPassword))
                    .role(User.Role.ADMIN)
                    .createdAt(java.time.LocalDateTime.now())
                    .updatedAt(java.time.LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            System.out.println("[DataSeeder] Default Admin User Created: admin@erp.com / (configured password)");
        } else {
            // Ensure existing admin has correct username and password
            User admin = adminOpt.get();
            boolean updated = false;

            if (admin.getUsername() == null || admin.getUsername().isEmpty()) {
                admin.setUsername("admin");
                updated = true;
            }

            // Sync admin password with configured value if it doesn't match
            // This handles: (1) password set with different APP_ADMIN_PASSWORD
            //               (2) isDefaultPassword flag incorrectly set by DB migration
            if (!passwordEncoder.matches(adminPassword, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setDefaultPassword(true);
                updated = true;
                System.out.println("[DataSeeder] Admin password synced with configured value");
            }

            if (updated) {
                userRepository.save(admin);
                System.out.println("[DataSeeder] Admin User updated");
            }
        }
    }
}
