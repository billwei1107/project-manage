package com.erp.dto;

import com.erp.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * @file ProjectRequest.java
 * @description 專案請求 DTO / Project Request DTO
 * @description_en Data Transfer Object for creating/updating a project
 * @description_zh 建立或更新專案的請求資料
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRequest {
    private String title;
    private String client;
    private Double budget;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private String description;
    private List<String> teamIds;
    private String githubRepo;
    private String githubBranch;
    private String backupConfig;
    private String githubToken;
    private String fileLocation;

    // New fields for GitHub Organization Integration
    private Boolean createGithubRepo;
    private String githubRepoDescription;
    private Boolean githubPrivate;
}
