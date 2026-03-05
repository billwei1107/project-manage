package com.erp.service.infoportal;

import com.erp.entity.User;
import com.erp.entity.infoportal.Directory;
import com.erp.entity.infoportal.ShareLink;
import com.erp.repository.UserRepository;
import com.erp.repository.infoportal.DirectoryRepository;
import com.erp.repository.infoportal.ShareLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShareLinkService {

    private final ShareLinkRepository shareLinkRepository;
    private final DirectoryRepository directoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public ShareLink createShareLink(String directoryId, String createdById, Integer expireDays) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new RuntimeException("Directory not found"));
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime expiresAt = null;
        if (expireDays != null && expireDays > 0) {
            expiresAt = LocalDateTime.now().plusDays(expireDays);
        }

        ShareLink shareLink = ShareLink.builder()
                .directory(directory)
                .createdBy(createdBy)
                .expiresAt(expiresAt)
                .isActive(true)
                .build();

        return shareLinkRepository.save(shareLink);
    }

    public ShareLink validateAndGetShareLink(String tokenId) {
        ShareLink link = shareLinkRepository.findByIdAndIsActiveTrue(tokenId)
                .orElseThrow(() -> new RuntimeException("Invalid or inactive share link"));

        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Share link has expired");
        }

        return link;
    }
}
