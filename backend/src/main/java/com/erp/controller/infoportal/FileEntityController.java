package com.erp.controller.infoportal;

import com.erp.entity.User;
import com.erp.entity.infoportal.FileEntity;
import com.erp.repository.UserRepository;
import com.erp.service.infoportal.FileEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileEntityController {

    private final FileEntityService fileEntityService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<FileEntity>> getFiles(@RequestParam String directoryId) {
        return ResponseEntity.ok(fileEntityService.getFilesInDirectory(directoryId));
    }

    @PostMapping("/upload")
    public ResponseEntity<FileEntity> uploadFile(
            @RequestParam("directoryId") String directoryId,
            @RequestParam("file") MultipartFile file) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User uploader = userRepository.findByUsernameOrEmployeeIdOrEmail(auth.getName(), auth.getName(), auth.getName())
                .orElse(null); // Should exist if authenticated

        String uploaderId = (uploader != null) ? uploader.getId() : null;

        return ResponseEntity.ok(fileEntityService.uploadFile(directoryId, uploaderId, file));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        Resource resource = fileEntityService.loadFileAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        fileEntityService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
