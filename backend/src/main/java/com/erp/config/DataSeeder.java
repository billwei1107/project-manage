package com.erp.config;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@erp.com")
                    .password(passwordEncoder.encode("password"))
                    .role(User.Role.ADMIN)
                    .createdAt(java.time.LocalDateTime.now())
                    .updatedAt(java.time.LocalDateTime.now())
                    .build();

            userRepository.save(admin);
            System.out.println("Default Admin User Created: admin@erp.com / password");
        }
    }
}
