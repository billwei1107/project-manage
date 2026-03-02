package com.erp.service;

import com.erp.dto.ProjectRequest;
import com.erp.dto.ProjectResponse;
import com.erp.entity.Project;
import com.erp.entity.ProjectStatus;
import com.erp.entity.User;
import com.erp.repository.ProjectRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.kohsuke.github.GHOrganization;
import org.kohsuke.github.HttpException;
import java.io.IOException;

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
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final com.erp.repository.TaskRepository taskRepository;
    private final GitHubService githubService;

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

        if (Boolean.TRUE.equals(request.getCreateGithubRepo())) {
            try {
                String repoNameToUse = (request.getGithubRepoName() != null && !request.getGithubRepoName().isBlank())
                        ? request.getGithubRepoName().trim().replaceAll("\\s+", "-").toLowerCase()
                        : request.getTitle().replaceAll("\\s+", "-").toLowerCase();

                String repoUrl = githubService.createOrganizationRepository(
                        repoNameToUse,
                        request.getGithubRepoDescription() != null ? request.getGithubRepoDescription()
                                : request.getDescription(),
                        Boolean.TRUE.equals(request.getGithubPrivate()));
                // We'll store the full URL or simply owner/repo format. The UI expects
                // owner/repo
                // Extract "bill-project-manage-system/repo-name" from URL
                String[] parts = repoUrl.split("/");
                if (parts.length >= 2) {
                    String orgAndRepo = parts[parts.length - 2] + "/" + parts[parts.length - 1];
                    project.setGithubRepo(orgAndRepo);

                    // Add collaborators (only the newly created repo needs to do this
                    // automatically)
                    syncGithubCollaborators(orgAndRepo, team);
                }
            } catch (HttpException e) {
                log.error("GitHub API error while creating repository: {} - {}", e.getResponseCode(), e.getMessage());
                String detail = e.getMessage();
                if (detail != null && detail.contains("name already exists")) {
                    throw new RuntimeException(
                            "GitHub 倉庫建立失敗：名稱 [" + request.getGithubRepoName() + "] 在組織中已存在，請嘗試其他名稱。");
                }
                throw new RuntimeException("GitHub 倉庫建立失敗 (API 錯誤): " + e.getMessage());
            } catch (IOException e) {
                log.error("Failed to create GitHub repository for project: {}", request.getTitle(), e);
                throw new RuntimeException("專案建立成功但 GitHub 倉庫建立失敗: " + e.getMessage());
            }
        }

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
            Set<User> newTeam = new HashSet<>(userRepository.findAllById(request.getTeamIds()));
            Set<User> oldTeam = project.getTeam() != null ? new HashSet<>(project.getTeam()) : new HashSet<>();

            log.info("Project update member sync: oldTeam={}, newTeam={}",
                    oldTeam.stream().map(User::getUsername).collect(Collectors.toList()),
                    newTeam.stream().map(User::getUsername).collect(Collectors.toList()));

            // Only sync collaborators if the project already has a GitHub repo linked
            if (project.getGithubRepo() != null && !project.getGithubRepo().isEmpty()) {
                // Find users who are in newTeam but not in oldTeam
                Set<User> addedMembers = newTeam.stream()
                        .filter(u -> !oldTeam.contains(u))
                        .collect(Collectors.toSet());

                if (!addedMembers.isEmpty()) {
                    log.info("Adding members to GitHub: {}",
                            addedMembers.stream().map(User::getUsername).collect(Collectors.toList()));
                    syncGithubCollaborators(project.getGithubRepo(), addedMembers);
                }

                // Find users who were removed (in oldTeam but not in newTeam)
                Set<User> removedMembers = oldTeam.stream()
                        .filter(u -> !newTeam.contains(u))
                        .collect(Collectors.toSet());

                if (!removedMembers.isEmpty()) {
                    log.info("Removing members from GitHub: {}",
                            removedMembers.stream().map(User::getUsername).collect(Collectors.toList()));
                    syncGithubCollaboratorRemovals(project.getGithubRepo(), removedMembers);
                }
            }

            project.setTeam(newTeam);
        }

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    /**
     * Remove team members as collaborators from the project's GitHub repository.
     */
    private void syncGithubCollaboratorRemovals(String fullRepoName, Set<User> users) {
        if (fullRepoName == null || fullRepoName.isEmpty())
            return;

        String repoName = fullRepoName;
        String[] parts = fullRepoName.split("/");
        if (parts.length == 2) {
            repoName = parts[1];
        }

        for (User user : users) {
            String githubUsername = user.getGithubUsername();
            if (githubUsername != null && !githubUsername.trim().isEmpty()) {
                try {
                    githubService.removeCollaboratorFromRepo(repoName, githubUsername);
                } catch (Exception e) {
                    log.error("Failed to remove collaborator {} from repository {}", githubUsername, repoName, e);
                }
            }
        }
    }

    /**
     * Add team members as collaborators to the project's GitHub repository.
     */
    private void syncGithubCollaborators(String fullRepoName, Set<User> users) {
        if (fullRepoName == null || fullRepoName.isEmpty())
            return;

        // Ensure we only use the repo name, not the owner/repo format if organization
        // name is already prefixed in GitHubService
        String repoName = fullRepoName;
        String[] parts = fullRepoName.split("/");
        if (parts.length == 2) {
            repoName = parts[1];
        }

        for (User user : users) {
            String githubUsername = user.getGithubUsername();
            if (githubUsername != null && !githubUsername.trim().isEmpty()) {
                try {
                    // Assign WRITE permission to DEV roles, and READ permission to others. Or set
                    // default to PUSH.
                    GHOrganization.Permission permission = user.getRole() == User.Role.DEV
                            ? GHOrganization.Permission.PUSH
                            : GHOrganization.Permission.PULL;
                    githubService.addCollaboratorToRepo(repoName, githubUsername, permission);
                } catch (Exception e) {
                    log.error("Failed to add collaborator {} to repository {}", githubUsername, repoName, e);
                }
            }
        }
    }

    /**
     * Force sync all team members to GitHub repository as collaborators
     */
    public void forceSyncGithubCollaborators(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Set<User> team = project.getTeam();
        if (team == null) {
            team = new HashSet<>();
        }

        String githubRepo = project.getGithubRepo();
        if (githubRepo == null || githubRepo.isEmpty()) {
            throw new RuntimeException("專案尚未綁定 GitHub 倉庫");
        }

        try {
            // Get actual repo name avoiding org prefix if there
            String repoName = githubRepo;
            String[] parts = githubRepo.split("/");
            if (parts.length == 2) {
                repoName = parts[1];
            }

            // Get current collaborators from GitHub
            Set<String> currentGithubCollaborators = githubService.getRepoCollaborators(repoName);

            // Determine desired collaborators based on ERP team (only those with GitHub
            // usernames)
            Set<String> desiredGithubUsernames = team.stream()
                    .map(User::getGithubUsername)
                    .filter(u -> u != null && !u.trim().isEmpty())
                    .collect(Collectors.toSet());

            // 1. Members to Add (in ERP team but not on GitHub)
            Set<User> membersToAdd = team.stream()
                    .filter(u -> {
                        String ghUsername = u.getGithubUsername();
                        return ghUsername != null && !ghUsername.trim().isEmpty()
                                && !currentGithubCollaborators.contains(ghUsername);
                    })
                    .collect(Collectors.toSet());

            if (!membersToAdd.isEmpty()) {
                log.info("Force sync: Adding missing members to GitHub: {}",
                        membersToAdd.stream().map(User::getUsername).collect(Collectors.toList()));
                syncGithubCollaborators(githubRepo, membersToAdd);
            }

            // 2. Members to Remove (on GitHub but not in ERP team)
            Set<String> usernamesToRemove = currentGithubCollaborators.stream()
                    .filter(ghUser -> !desiredGithubUsernames.contains(ghUser))
                    .collect(Collectors.toSet());

            if (!usernamesToRemove.isEmpty()) {
                log.info("Force sync: Removing extra collaborators from GitHub: {}", usernamesToRemove);
                for (String ghUsername : usernamesToRemove) {
                    try {
                        githubService.removeCollaboratorFromRepo(repoName, ghUsername);
                    } catch (Exception e) {
                        log.error("Failed to remove collaborator {} from repository {}", ghUsername, repoName, e);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to force sync GitHub collaborators for project: {}", projectId, e);
            throw new RuntimeException("同步 GitHub 成員失敗", e);
        }
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
        List<ProjectResponse.MemberInfo> teamInfo = project.getTeam() != null ? project.getTeam().stream()
                .map(user -> ProjectResponse.MemberInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .githubUsername(user.getGithubUsername())
                        .build())
                .collect(Collectors.toList()) : null;

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .client(project.getClient())
                .budget(project.getBudget())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .progress(calculateProgress(project.getId()))
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
