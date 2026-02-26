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
    private final com.erp.repository.TaskRepository taskRepository;

    /**
     * Get all projects / 獲取所有專案
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized");
        }
        String loginId = authentication.getName();
        User currentUser = userRepository.findByUsernameOrEmployeeIdOrEmail(loginId, loginId, loginId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects;
        if (currentUser.getRole() == User.Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findByCreatorOrTeamContaining(currentUser, currentUser);
        }

        return projects.stream()
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

        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        String loginId = authentication.getName();
        User currentUser = userRepository.findByUsernameOrEmployeeIdOrEmail(loginId, loginId, loginId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .client(request.getClient())
                .budget(request.getBudget())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNING)
                .description(request.getDescription())
                .githubRepo(request.getGithubRepo())
                .githubBranch(request.getGithubBranch())
                .backupConfig(request.getBackupConfig())
                .githubToken(request.getGithubToken())
                .fileLocation(request.getFileLocation())
                .progress(0) // Default progress
                .team(team)
                .creator(currentUser)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    /**
     * Update project / 更新專案
     */
    public ProjectResponse updateProject(String id, ProjectRequest request) {
        System.out.println("DEBUG: Updating project " + id);
        System.out.println("DEBUG: Request Token: " + (request.getGithubToken() != null ? "PRESENT" : "NULL"));
        System.out.println("DEBUG: Request FileLocation: " + request.getFileLocation());

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        project.setTitle(request.getTitle());
        project.setClient(request.getClient());
        project.setBudget(request.getBudget());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setDescription(request.getDescription());
        project.setGithubRepo(request.getGithubRepo());
        project.setGithubBranch(request.getGithubBranch());
        project.setBackupConfig(request.getBackupConfig());
        project.setGithubToken(request.getGithubToken());
        project.setFileLocation(request.getFileLocation());

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
                .status(project.getStatus())
                .progress(calculateProgress(project.getId()))
                .description(project.getDescription())
                .description(project.getDescription())
                .team(teamInfo)
                .githubRepo(project.getGithubRepo())
                .githubBranch(project.getGithubBranch())
                .backupConfig(project.getBackupConfig())
                .githubToken(project.getGithubToken())
                .fileLocation(project.getFileLocation())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private Integer calculateProgress(String projectId) {
        Integer totalTasks = taskRepository.countByProjectId(projectId);
        if (totalTasks == 0) {
            return 0;
        }
        Integer completedTasks = taskRepository.countByProjectIdAndStatus(projectId, com.erp.entity.TaskStatus.DONE);
        return (int) Math.round(((double) completedTasks / totalTasks) * 100);
    }
}
