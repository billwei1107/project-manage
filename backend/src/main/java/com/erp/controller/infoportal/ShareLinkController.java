package com.erp.controller.infoportal;

import com.erp.entity.User;
import com.erp.entity.infoportal.FileEntity;
import com.erp.entity.infoportal.ShareLink;
import com.erp.repository.UserRepository;
import com.erp.service.infoportal.FileEntityService;
import com.erp.service.infoportal.ShareLinkService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/share-links")
@RequiredArgsConstructor
public class ShareLinkController {

    private final ShareLinkService shareLinkService;
    private final FileEntityService fileEntityService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ShareLink> createShareLink(@RequestBody CreateShareLinkRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User creator = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(shareLinkService.createShareLink(
                request.getDirectoryId(), creator.getId(), request.getExpireDays()));
    }

    // Public endpoint for non-logged-in users
    @GetMapping("/public/info/{tokenId}")
    public ResponseEntity<Map<String, Object>> getShareLinkInfo(@PathVariable String tokenId) {
        ShareLink link = shareLinkService.validateAndGetShareLink(tokenId);

        Map<String, Object> info = new HashMap<>();
        info.put("directoryName", link.getDirectory().getName());
        info.put("clientName", link.getDirectory().getClient().getName());
        info.put("creatorName", link.getCreatedBy().getName());
        info.put("expiresAt", link.getExpiresAt());

        return ResponseEntity.ok(info);
    }

    @PostMapping("/public/upload/{tokenId}")
    public ResponseEntity<FileEntity> publicUpload(
            @PathVariable String tokenId,
            @RequestParam("file") MultipartFile file) {

        ShareLink link = shareLinkService.validateAndGetShareLink(tokenId);

        // uploaderId is null since it's a public upload
        FileEntity fileEntity = fileEntityService.uploadFile(link.getDirectory().getId(), null, file);
        return ResponseEntity.ok(fileEntity);
    }

    @Data
    public static class CreateShareLinkRequest {
        private String directoryId;
        private Integer expireDays;
    }
}
