package com.erp.service;

import com.erp.dto.TaskRequest;
import com.erp.dto.TaskResponse;
import com.erp.entity.Project;
import com.erp.entity.Task;
import com.erp.entity.TaskStatus;
import com.erp.entity.User;
import com.erp.repository.ProjectRepository;
import com.erp.repository.TaskRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @file TaskService.java
 * @description 任務服務邏輯 / Task Service
 * @description_en Business logic for managing tasks
 * @description_zh 處理任務的 CRUD 與狀態更新
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Get tasks by project ID / 獲取專案的所有任務
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create new task / 建立新任務
     */
    public TaskResponse createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElse(null);
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .project(project)
                .assignee(assignee)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    /**
     * Update task / 更新任務
     */
    public TaskResponse updateTask(String id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getOrderIndex() != null) {
            task.setOrderIndex(request.getOrderIndex());
        }
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElse(null);
            task.setAssignee(assignee);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    /**
     * Delete task / 刪除任務
     */
    public void deleteTask(String id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse.AssigneeInfo assigneeInfo = null;
        if (task.getAssignee() != null) {
            assigneeInfo = TaskResponse.AssigneeInfo.builder()
                    .id(task.getAssignee().getId())
                    .name(task.getAssignee().getName())
                    .email(task.getAssignee().getEmail())
                    .build();
        }

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .status(task.getStatus())
                .orderIndex(task.getOrderIndex())
                .projectId(task.getProject().getId())
                .assignee(assigneeInfo)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
