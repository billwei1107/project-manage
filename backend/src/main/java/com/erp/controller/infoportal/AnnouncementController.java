package com.erp.controller.infoportal;

import com.erp.entity.User;
import com.erp.entity.infoportal.Announcement;
import com.erp.repository.UserRepository;
import com.erp.service.infoportal.AnnouncementService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(announcementService.getPublishedAnnouncements());
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody CreateAnnouncementRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User author = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(announcementService.createAnnouncement(
                request.getTitle(), request.getContent(), request.getType(), author.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncement(@PathVariable String id) {
        return ResponseEntity.ok(announcementService.getAnnouncement(id));
    }

    @Data
    public static class CreateAnnouncementRequest {
        private String title;
        private String content;
        private String type;
    }
}
