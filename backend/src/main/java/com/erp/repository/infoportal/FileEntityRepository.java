package com.erp.repository.infoportal;

import com.erp.entity.infoportal.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileEntityRepository extends JpaRepository<FileEntity, String> {
    List<FileEntity> findByDirectoryIdOrderByCreatedAtDesc(String directoryId);
}
