package com.erp.repository.infoportal;

import com.erp.entity.infoportal.Directory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, String> {
    List<Directory> findByClientIdAndParentIdOrderByCreatedAtDesc(String clientId, String parentId);

    List<Directory> findByClientIdAndParentIsNullOrderByCreatedAtDesc(String clientId);
}
