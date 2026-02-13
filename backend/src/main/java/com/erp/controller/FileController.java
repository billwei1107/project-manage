package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * @file FileController.java
 * @description 檔案管理控制器 / File Management Controller
 * @description_en Exposes generic file operations for projects
 * @description_zh 提供專案檔案的上傳、下載、列表與刪除 API
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<ApiResponse<List<String>>> uploadFiles(
            @PathVariable String projectId,
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> fileNames = files.stream().map(file -> {
                try {
                    return fileService.storeFile(projectId, file);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
                }
            }).toList();
            return ResponseEntity.ok(ApiResponse.success(fileNames));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to upload files: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> listFiles(@PathVariable String projectId) {
        try {
            List<String> files = fileService.getAllFiles(projectId);
            return ResponseEntity.ok(ApiResponse.success(files));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to list files: " + e.getMessage()));
        }
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String projectId,
            @RequestParam String fileName) {
        try {
            Resource resource = fileService.loadFileAsResource(projectId, fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @PathVariable String projectId,
            @RequestParam String fileName) {
        try {
            fileService.deleteFile(projectId, fileName);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(e.getMessage()));
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to delete file: " + e.getMessage()));
        }
    }
}
