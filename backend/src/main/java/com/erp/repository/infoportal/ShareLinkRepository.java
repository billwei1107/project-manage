package com.erp.repository.infoportal;

import com.erp.entity.infoportal.ShareLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShareLinkRepository extends JpaRepository<ShareLink, String> {
    Optional<ShareLink> findByIdAndIsActiveTrue(String id);
}
