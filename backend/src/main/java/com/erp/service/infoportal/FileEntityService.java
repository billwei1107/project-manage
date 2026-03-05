package com.erp.service.infoportal;

import com.erp.entity.User;
import com.erp.entity.infoportal.Directory;
import com.erp.entity.infoportal.FileEntity;
import com.erp.repository.UserRepository;
import com.erp.repository.infoportal.DirectoryRepository;
import com.erp.repository.infoportal.FileEntityRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileEntityService {

    private final FileEntityRepository fileEntityRepository;
    private final DirectoryRepository directoryRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}/info-portal")
    private String portalUploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(portalUploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("InfoPortal upload directory configured at {}", this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the info-portal upload directory.", ex);
        }
    }

    public List<FileEntity> getFilesInDirectory(String directoryId) {
        return fileEntityRepository.findByDirectoryIdOrderByCreatedAtDesc(directoryId);
    }

    @Transactional
    public FileEntity uploadFile(String directoryId, String uploaderId, MultipartFile multipartFile) {
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new RuntimeException("Directory not found"));

        User uploader = null;
        if (uploaderId != null && !uploaderId.isEmpty()) {
            uploader = userRepository.findById(uploaderId).orElse(null);
        }

        String originalFileName = StringUtils.cleanPath(
                multipartFile.getOriginalFilename() != null ? multipartFile.getOriginalFilename() : "unknown-file");

        if (originalFileName.contains("..")) {
            throw new RuntimeException("Filename contains invalid path sequence " + originalFileName);
        }

        String extension = "";
        int extIndex = originalFileName.lastIndexOf(".");
        if (extIndex > 0) {
            extension = originalFileName.substring(extIndex);
        }

        // Generate unique physical file name
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(multipartFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileEntity fileEntity = FileEntity.builder()
                    .directory(directory)
                    .uploader(uploader)
                    .originalName(originalFileName)
                    .storagePath(uniqueFileName)
                    .fileSize(multipartFile.getSize())
                    .mimeType(multipartFile.getContentType())
                    .build();

            return fileEntityRepository.save(fileEntity);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileId) {
        FileEntity fileEntity = fileEntityRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
            Path filePath = this.fileStorageLocation.resolve(fileEntity.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File physically not found " + fileEntity.getStoragePath());
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found " + fileId, ex);
        }
    }

    @Transactional
    public void deleteFile(String fileId) {
        FileEntity fileEntity = fileEntityRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
            Path filePath = this.fileStorageLocation.resolve(fileEntity.getStoragePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.error("Failed to delete physical file", ex);
        }

        fileEntityRepository.delete(fileEntity);
    }
}
