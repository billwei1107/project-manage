package com.erp.service.infoportal;

import com.erp.entity.infoportal.Announcement;
import com.erp.entity.User;
import com.erp.repository.infoportal.AnnouncementRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public List<Announcement> getPublishedAnnouncements() {
        return announcementRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public Announcement createAnnouncement(String title, String content, String typeStr, String authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Announcement.AnnouncementType type = Announcement.AnnouncementType.valueOf(typeStr);

        Announcement announcement = Announcement.builder()
                .title(title)
                .content(content)
                .type(type)
                .author(author)
                .isPublished(true)
                .build();

        return announcementRepository.save(announcement);
    }

    public Announcement getAnnouncement(String id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
    }
}
