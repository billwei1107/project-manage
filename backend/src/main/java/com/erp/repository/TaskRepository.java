package com.erp.repository;

import com.erp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.erp.entity.Project;

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

        List<Task> findByProjectIn(List<Project> projects);

        @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t " +
                        "WHERE t.project IN :projects " +
                        "AND t.status != 'DONE' " +
                        "AND t.deadline IS NOT NULL " +
                        "AND t.deadline <= :thresholdDate " +
                        "ORDER BY t.deadline ASC")
        List<Task> findUpcomingAndOverdueTasks(
                        @org.springframework.data.repository.query.Param("projects") List<Project> projects,
                        @org.springframework.data.repository.query.Param("thresholdDate") java.time.LocalDateTime thresholdDate);
}
