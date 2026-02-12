package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.dto.ProjectRequest;
import com.erp.dto.ProjectResponse;
import com.erp.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @file ProjectController.java
 * @description 專案控制器 / Project Controller
 * @description_en Rest API for project management
 * @description_zh 專案管理的 Rest API 接口
 */
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        return ResponseEntity
                .ok(ApiResponse.success("Projects retrieved successfully", projectService.getAllProjects()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable String id) {
        return ResponseEntity
                .ok(ApiResponse.success("Project retrieved successfully", projectService.getProjectById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success("Project created successfully", projectService.createProject(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable String id,
            @RequestBody ProjectRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success("Project updated successfully", projectService.updateProject(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<ProjectResponse.MemberInfo>>> getProjectMembers(@PathVariable String id) {
        return ResponseEntity
                .ok(ApiResponse.success("Members retrieved successfully", projectService.getProjectById(id).getTeam()));
    }
}
