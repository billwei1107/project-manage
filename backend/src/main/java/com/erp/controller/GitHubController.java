package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * @file GitHubController.java
 * @description GitHub 控制器 / GitHub Controller
 * @description_en API endpoints for GitHub repository and branch management
 * @description_zh 提供 GitHub 儲存庫與分支管理的 API 端點
 */
@RestController
@RequestMapping("/api/v1/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubService githubService;

    /**
     * Create a new GitHub repository / 建立新的 GitHub 儲存庫
     */
    @PostMapping("/repos")
    public ResponseEntity<ApiResponse<String>> createRepository(@RequestBody Map<String, Object> request)
            throws IOException {
        String token = (String) request.get("token");
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        boolean isPrivate = (boolean) request.getOrDefault("private", false);

        String url = githubService.createRepository(token, name, description, isPrivate);
        return ResponseEntity.ok(ApiResponse.success("GitHub repository created successfully", url));
    }

    /**
     * Get branches for a repository / 獲取儲存庫的分支列表
     */
    @GetMapping("/repos/{owner}/{repo}/branches")
    public ResponseEntity<ApiResponse<List<String>>> getBranches(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestParam String token) throws IOException {
        List<String> branches = githubService.getBranches(token, owner + "/" + repo);
        return ResponseEntity.ok(ApiResponse.success("Branches retrieved successfully", branches));
    }

    /**
     * Create a new branch / 建立新分支
     */
    @PostMapping("/repos/{owner}/{repo}/branches")
    public ResponseEntity<ApiResponse<String>> createBranch(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestBody Map<String, String> request) throws IOException {
        String token = request.get("token");
        String newBranch = request.get("newBranch");
        String sourceBranch = request.get("sourceBranch");

        githubService.createBranch(token, owner + "/" + repo, newBranch, sourceBranch);
        return ResponseEntity.ok(ApiResponse.success("Branch created successfully", newBranch));
    }

    /**
     * Get repository download URL / 獲取儲存庫下載連結
     */
    @GetMapping("/repos/{owner}/{repo}/download")
    public ResponseEntity<ApiResponse<String>> getDownloadUrl(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestParam String branch,
            @RequestParam String token) throws IOException {
        String url = githubService.getDownloadUrl(token, owner + "/" + repo, branch);
        return ResponseEntity.ok(ApiResponse.success("Download URL retrieved", url));
    }

    /**
     * Verify if a repository exists / 驗證儲存庫是否存在
     */
    @GetMapping("/repos/{owner}/{repo}/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkRepoExists(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestParam String token) {
        boolean exists = githubService.repositoryExists(token, owner + "/" + repo);
        return ResponseEntity.ok(ApiResponse.success("Repository check completed", exists));
    }

    /**
     * Get the authenticated user's login name / 獲取授權用戶的登入名稱
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> getAuthenticatedUser(@RequestParam String token) throws IOException {
        String login = githubService.getAuthenticatedUser(token);
        return ResponseEntity.ok(ApiResponse.success("Authenticated user retrieved", login));
    }
}
