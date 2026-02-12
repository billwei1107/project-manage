package com.erp.dto;

import com.erp.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @file ProjectResponse.java
 * @description 專案回應 DTO / Project Response DTO
 * @description_en Data Transfer Object for project details
 * @description_zh 專案詳細資料回應
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    private String id;
    private String title;
    private String client;
    private Double budget;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private Integer progress;
    private String description;
    private List<MemberInfo> team;
    private String githubRepo;
    private String githubBranch;
    private String backupConfig;
    private String githubToken;
    private String fileLocation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MemberInfo {
        private String id;
        private String name;
        private String email;
        private com.erp.entity.User.Role role;
    }
}
