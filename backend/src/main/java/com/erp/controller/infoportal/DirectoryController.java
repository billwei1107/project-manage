package com.erp.controller.infoportal;

import com.erp.entity.infoportal.Directory;
import com.erp.service.infoportal.DirectoryService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/directories")
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService directoryService;

    @GetMapping
    public ResponseEntity<List<Directory>> getDirectories(
            @RequestParam String clientId,
            @RequestParam(required = false) String parentId) {
        return ResponseEntity.ok(directoryService.getDirectories(clientId, parentId));
    }

    @PostMapping
    public ResponseEntity<Directory> createDirectory(@RequestBody CreateDirectoryRequest request) {
        return ResponseEntity
                .ok(directoryService.createDirectory(request.getClientId(), request.getParentId(), request.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Directory> renameDirectory(@PathVariable String id, @RequestBody RenameRequest request) {
        return ResponseEntity.ok(directoryService.renameDirectory(id, request.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDirectory(@PathVariable String id) {
        directoryService.deleteDirectory(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateDirectoryRequest {
        private String clientId;
        private String parentId;
        private String name;
    }

    @Data
    public static class RenameRequest {
        private String name;
    }
}
