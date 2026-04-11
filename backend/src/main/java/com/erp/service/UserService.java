package com.erp.service;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * @file UserService.java
 * @description 使用者服務邏輯 / User Service
 * @description_en Business logic for user data and avatars
 * @description_zh 處理使用者資料存取與大頭貼上傳
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;

    @Value("${app.upload.dir:/app/uploads}")
    private String baseUploadDir;

    public void updateAvatar(String userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is strictly empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        try {
            // Determine ext
            String originalFileName = file.getOriginalFilename();
            String ext = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                ext = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // Create target filename
            String fileName = "avatar_" + user.getId() + "_" + UUID.randomUUID() + ext;

            // Ensure upload directory exists
            Path avatarDir = Paths.get(baseUploadDir).resolve("avatars").normalize().toAbsolutePath();
            if (!Files.exists(avatarDir)) {
                Files.createDirectories(avatarDir);
            }

            Path targetPath = avatarDir.resolve(fileName);
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Save public URL path
            String avatarUrl = "/api/v1/users/avatars/" + fileName;
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            log.info("User {} uploaded new avatar {}", userId, avatarUrl);
        } catch (Exception e) {
            log.error("Failed to upload avatar for user {}", userId, e);
            throw new RuntimeException("Failed to upload avatar", e);
        }
    }
}
