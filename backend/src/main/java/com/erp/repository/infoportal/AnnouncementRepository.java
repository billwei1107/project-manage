package com.erp.repository.infoportal;

import com.erp.entity.infoportal.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findByIsPublishedTrueOrderByCreatedAtDesc();
}
