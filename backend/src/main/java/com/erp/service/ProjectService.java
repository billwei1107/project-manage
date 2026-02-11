package com.erp.service;

import com.erp.dto.ProjectRequest;
import com.erp.dto.ProjectResponse;
import com.erp.entity.Project;
import com.erp.entity.ProjectStatus;
import com.erp.entity.User;
import com.erp.repository.ProjectRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @file ProjectService.java
 * @description 專案服務邏輯 / Project Service
 * @description_en Business logic for managing projects
 * @description_zh 處理專案的 CRUD 與團隊成員管理
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Get all projects / 獲取所有專案
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get project by ID / 根據 ID 獲取專案
     */
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    /**
     * Create new project / 建立新專案
     */
    public ProjectResponse createProject(ProjectRequest request) {
        Set<User> team = new HashSet<>();
        if (request.getTeamIds() != null && !request.getTeamIds().isEmpty()) {
            team.addAll(userRepository.findAllById(request.getTeamIds()));
        }

        Project project = Project.builder()
                .title(request.getTitle())
                .client(request.getClient())
                .budget(request.getBudget())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNING)
                .description(request.getDescription())
                .progress(0) // Default progress
                .team(team)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    /**
     * Update project / 更新專案
     */
    public ProjectResponse updateProject(String id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        project.setTitle(request.getTitle());
        project.setClient(request.getClient());
        project.setBudget(request.getBudget());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setDescription(request.getDescription());

        if (request.getTeamIds() != null) {
            Set<User> team = new HashSet<>(userRepository.findAllById(request.getTeamIds()));
            project.setTeam(team);
        }

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    /**
     * Delete project / 刪除專案
     */
    public void deleteProject(String id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectResponse mapToResponse(Project project) {
        List<ProjectResponse.MemberInfo> teamInfo = project.getTeam().stream()
                .map(user -> ProjectResponse.MemberInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .client(project.getClient())
                .budget(project.getBudget())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .progress(project.getProgress())
                .description(project.getDescription())
                .team(teamInfo)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
