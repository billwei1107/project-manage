package com.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHBranch;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    private GitHub getGitHubClient(String token) throws IOException {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("GitHub Token is required");
        }
        try {
            GitHub github = new GitHubBuilder().withOAuthToken(token).build();
            github.checkApiUrlValidity();
            return github;
        } catch (IOException e) {
            log.error("Failed to initialize GitHub client: {}", e.getMessage());
            throw e;
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
        return repo.getArchiveLink(branch).toString(); // Default zipball
    }
}
