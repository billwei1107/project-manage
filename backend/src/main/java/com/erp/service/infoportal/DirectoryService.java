package com.erp.service.infoportal;

import com.erp.entity.infoportal.Client;
import com.erp.entity.infoportal.Directory;
import com.erp.repository.infoportal.DirectoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DirectoryService {

    private final DirectoryRepository directoryRepository;
    private final ClientService clientService;

    public List<Directory> getDirectories(String clientId, String parentId) {
        if (parentId == null || parentId.isEmpty()) {
            return directoryRepository.findByClientIdAndParentIsNullOrderByCreatedAtDesc(clientId);
        }
        return directoryRepository.findByClientIdAndParentIdOrderByCreatedAtDesc(clientId, parentId);
    }

    @Transactional
    public Directory createDirectory(String clientId, String parentId, String name) {
        Client client = clientService.getClient(clientId);
        Directory parent = null;
        if (parentId != null && !parentId.isEmpty()) {
            parent = directoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent directory not found"));
        }

        Directory dir = Directory.builder()
                .client(client)
                .parent(parent)
                .name(name)
                .build();
        return directoryRepository.save(dir);
    }

    @Transactional
    public Directory renameDirectory(String id, String newName) {
        Directory dir = directoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Directory not found"));
        dir.setName(newName);
        return directoryRepository.save(dir);
    }

    @Transactional
    public void deleteDirectory(String id) {
        // Cascade deletion logic should handle files and subdirectories
        // Usually, in a real system we do soft deletes or check if empty.
        // For simplicity, we just delete the directory entity.
        directoryRepository.deleteById(id);
    }
}
