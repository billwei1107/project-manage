package com.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @file GitHubService.java
 * @description GitHub 整合服務 / GitHub Integration Service
 * @description_en Handles GitHub API interactions like repo creation and branch
 *                 listing
 * @description_zh 處理 GitHub API 互動，如建立儲存庫與獲取分支列表
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GitHubService {

    @Value("${github.org.name:}")
    private String organizationName;

    @Value("${github.org.token:}")
    private String organizationToken;

    private GitHub getGitHubClient(String token) throws IOException {
        String actualToken = (token == null || token.isBlank()) ? organizationToken : token;

        if (actualToken == null || actualToken.isBlank() || "ghp_placeholder".equals(actualToken)) {
            throw new IllegalArgumentException("GitHub Organization Token 未配置，請設定 GITHUB_ORG_TOKEN 環境變數");
        }
        try {
            GitHub github = new GitHubBuilder().withOAuthToken(actualToken).build();
            github.checkApiUrlValidity();
            return github;
        } catch (IOException e) {
            log.error("Failed to initialize GitHub client: {}", e.getMessage());
            throw new RuntimeException("GitHub 連線失敗，請檢查 Token 權限是否正確: " + e.getMessage(), e);
        }
    }

    /**
     * Create a new GitHub repository / 建立新的 GitHub 儲存庫
     */
    public String createRepository(String token, String name, String description, boolean isPrivate)
            throws IOException {
        log.info("Creating GitHub repository: {}", name);
        GitHub github = getGitHubClient(token);
        GHRepository repo = github.createRepository(name)
                .description(description)
                .private_(isPrivate)
                .create();
        log.info("Repository created: {}", repo.getHtmlUrl());
        return repo.getHtmlUrl().toString();
    }

    /**
     * Create a new GitHub repository under the configured Organization
     */
    public String createOrganizationRepository(String name, String description, boolean isPrivate) throws IOException {
        if (organizationName == null || organizationName.isEmpty()) {
            throw new IllegalStateException("GitHub Organization Name is not configured");
        }

        log.info("Creating GitHub repository {} under organization: {}", name, organizationName);
        GitHub github = getGitHubClient(organizationToken);

        GHRepository repo = github.getOrganization(organizationName)
                .createRepository(name)
                .description(description)
                .private_(isPrivate)
                .create();

        log.info("Organization repository created: {}", repo.getHtmlUrl());
        return repo.getHtmlUrl().toString();
    }

    /**
     * Add a collaborator to an organization's repository
     */
    public void addCollaboratorToRepo(String repoName, String githubUsername,
            org.kohsuke.github.GHOrganization.Permission permission) throws IOException {
        if (organizationName == null || organizationName.isEmpty()) {
            throw new IllegalStateException("GitHub Organization Name is not configured");
        }

        log.info("Adding collaborator {} to repository {}/{} with permission {}", githubUsername, organizationName,
                repoName, permission);
        GitHub github = getGitHubClient(organizationToken);
        GHRepository repo = github.getRepository(organizationName + "/" + repoName);

        repo.addCollaborators(java.util.Collections.singletonList(github.getUser(githubUsername)), permission);
        log.info("Collaborator added successfully");
    }

    /**
     * Remove a collaborator from an organization's repository
     */
    public void removeCollaboratorFromRepo(String repoName, String githubUsername) throws IOException {
        if (organizationName == null || organizationName.isEmpty()) {
            throw new IllegalStateException("GitHub Organization Name is not configured");
        }

        log.info("Removing collaborator {} from repository {}/{}", githubUsername, organizationName, repoName);
        GitHub github = getGitHubClient(organizationToken);
        GHRepository repo = github.getRepository(organizationName + "/" + repoName);

        repo.removeCollaborators(github.getUser(githubUsername));
        log.info("Collaborator removed successfully");
    }

    // Get current collaborators of a repository
    public Set<String> getRepoCollaborators(String repoName) throws IOException {
        if (organizationName == null || organizationName.isEmpty()) {
            throw new IllegalStateException("GitHub Organization Name is not configured");
        }

        GitHub github = getGitHubClient(organizationToken);
        GHRepository repo = github.getRepository(organizationName + "/" + repoName);

        Set<String> collaborators = repo.getCollaborators().stream()
                .map(target -> {
                    try {
                        return target.getLogin();
                    } catch (Exception e) {
                        return "";
                    }
                })
                .filter(login -> !login.isEmpty())
                .collect(java.util.stream.Collectors.toSet());

        return collaborators;
    }

    /**
     * Get branches for a repository / 獲取儲存庫的分支列表
     */
    public List<String> getBranches(String token, String repoName) throws IOException {
        log.info("Fetching branches for repository: {}", repoName);
        try {
            GitHub github = getGitHubClient(token);
            GHRepository repo = github.getRepository(repoName);
            return new ArrayList<>(repo.getBranches().keySet());
        } catch (IOException e) {
            log.error("Error fetching branches for {}: {}", repoName, e.getMessage());
            throw e;
        }
    }

    /**
     * Verify if a repository exists / 驗證儲存庫是否存在
     */
    public boolean repositoryExists(String token, String repoName) {
        try {
            GitHub github = getGitHubClient(token);
            github.getRepository(repoName);
            return true;
        } catch (IOException e) {
            log.warn("Repository {} does not exist or access denied: {}", repoName, e.getMessage());
            return false;
        }
    }

    /**
     * Get the authenticated user's login name / 獲取授權用戶的登入名稱
     */
    public String getAuthenticatedUser(String token) throws IOException {
        GitHub github = getGitHubClient(token);
        return github.getMyself().getLogin();
    }

    /**
     * Create a new branch / 建立新分支
     */
    public void createBranch(String token, String repoName, String newBranch, String sourceBranch) throws IOException {
        log.info("Creating branch {} from {} in {}", newBranch, sourceBranch, repoName);
        GitHub github = getGitHubClient(token);
        GHRepository repo = github.getRepository(repoName);
        String sha = repo.getBranch(sourceBranch).getSHA1();
        repo.createRef("refs/heads/" + newBranch, sha);
    }

    /**
     * Get download URL (zipball) / 獲取下載連結
     */
    public String getDownloadUrl(String token, String repoName, String branch) throws IOException {
        GitHub github = getGitHubClient(token);
        GHRepository repo = github.getRepository(repoName);
        return repo.getHtmlUrl().toString() + "/archive/" + branch + ".zip";
    }

    /**
     * Get repository content (files and directories) / 獲取儲存庫內容
     */
    public List<Map<String, Object>> getRepoContent(String token, String repoName, String path) throws IOException {
        GitHub github = getGitHubClient(token);
        GHRepository repo = github.getRepository(repoName);
        List<org.kohsuke.github.GHContent> contents = repo.getDirectoryContent(path != null ? path : "");

        List<Map<String, Object>> result = new ArrayList<>();
        for (org.kohsuke.github.GHContent content : contents) {
            result.add(Map.of(
                    "name", content.getName(),
                    "path", content.getPath(),
                    "type", content.isDirectory() ? "dir" : "file",
                    "size", content.getSize(),
                    "html_url", content.getHtmlUrl() != null ? content.getHtmlUrl().toString() : "",
                    "download_url", content.getDownloadUrl() != null ? content.getDownloadUrl() : ""));
        }
        return result;
    }

    /**
     * Download repository archive (proxied via backend) / 下載儲存庫壓縮檔
     */
    public void downloadRepoArchive(String token, String repoName, String branch, java.io.OutputStream outputStream)
            throws IOException {
        GitHub github = getGitHubClient(token);
        GHRepository repo = github.getRepository(repoName);
        // Using readZip to stream content to the output stream
        repo.readZip(is -> {
            is.transferTo(outputStream);
            return null;
        }, branch);
    }
}
