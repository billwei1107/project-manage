package com.erp.repository;

import com.erp.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @file ProjectRepository.java
 * @description 專案資料庫存取層 / Project Repository
 * @description_en JPA Repository for Project entity
 * @description_zh 專案實體的 JPA 存取介面
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
}
