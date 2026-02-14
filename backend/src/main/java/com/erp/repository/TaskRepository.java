package com.erp.repository;

import com.erp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @file TaskRepository.java
 * @description 任務資料庫存取層 / Task Repository
 * @description_en JPA Repository for Task entity
 * @description_zh 任務實體的 JPA 存取介面
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByProjectId(String projectId);

    Integer countByProjectId(String projectId);

    Integer countByProjectIdAndStatus(String projectId, com.erp.entity.TaskStatus status);
}
