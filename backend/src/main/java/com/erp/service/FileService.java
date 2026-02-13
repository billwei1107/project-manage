package com.erp.service;

import com.erp.entity.Project;
import com.erp.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @file FileService.java
 * @description 檔案管理服務 / File Management Service
 * @description_en Handles file storage, retrieval, and deletion for projects
 * @description_zh 處理專案檔案的儲存、讀取與刪除
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    private final ProjectRepository projectRepository;

    /**
     * Store a file for a specific project / 儲存專案檔案
     */
    @Transactional
    public String storeFile(String projectId, MultipartFile file) throws IOException {
        Project project = getProjectAndCheckAccess(projectId);
        String uploadDir = project.getFileLocation();

        // Default to /app/uploads/{projectId} if not configured
        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "/app/uploads/" + projectId;
        }

        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(fileStorageLocation);

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Invalid path sequence in filename: " + originalFileName);
        }

        Path targetLocation = fileStorageLocation.resolve(originalFileName);
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return originalFileName;
    }

    /**
     * Load a file as a resource / 載入檔案資源
     */
    @Transactional(readOnly = true)
    public Resource loadFileAsResource(String projectId, String fileName) throws MalformedURLException {
        Project project = getProjectAndCheckAccess(projectId);
        String uploadDir = project.getFileLocation();

        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            throw new IllegalArgumentException("Project file location is not configured");
        }

        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found: " + fileName);
        }
    }

    /**
     * List all files for a project / 列出專案所有檔案
     */
    @Transactional(readOnly = true)
    public List<String> getAllFiles(String projectId) throws IOException {
        Project project = getProjectAndCheckAccess(projectId);
        String uploadDir = project.getFileLocation();

        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "/app/uploads/" + projectId;
        }

        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(fileStorageLocation)) {
            return List.of();
        }

        try (Stream<Path> stream = Files.walk(fileStorageLocation)) {
            return stream
                    .filter(file -> !Files.isDirectory(file))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toList());
        }
    }

    /**
     * Delete a file / 刪除檔案
     */
    @Transactional
    public void deleteFile(String projectId, String fileName) throws IOException {
        Project project = getProjectAndCheckAccess(projectId);
        String uploadDir = project.getFileLocation();

        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "/app/uploads/" + projectId;
        }

        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Files.deleteIfExists(filePath);
    }

    private Project getProjectAndCheckAccess(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        checkAccess(project);
        return project;
    }

    private void checkAccess(Project project) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }

        String email = auth.getName();

        // 1. Check if Admin
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin)
            return;

        // 2. Check if in team
        boolean isMember = project.getTeam().stream()
                .anyMatch(u -> u.getEmail().equals(email));

        if (!isMember) {
            throw new AccessDeniedException("User not authorized to access files for this project");
        }
    }
}
