package com.erp.service;

import com.erp.dto.EventRequest;
import com.erp.dto.EventResponse;
import com.erp.entity.Event;
import com.erp.entity.User;
import com.erp.repository.EventRepository;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @file EventService.java
 * @description 事件服務邏輯 / Event Service
 * @description_en Business logic for managing calendar events
 * @description_zh 處理行事曆事件的 CRUD 與業務邏輯
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * 獲取當前登入使用者的所有事件 / Get all events for the current user
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getMyEvents() {
        User currentUser = getCurrentUser();
        return eventRepository.findByCreatorOrderByStartDateAsc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 建立新事件 / Create new event
     */
    public EventResponse createEvent(EventRequest request) {
        User currentUser = getCurrentUser();

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : Event.Priority.Medium)
                .repeatType(request.getRepeatType() != null ? request.getRepeatType() : Event.RepeatType.None)
                .creator(currentUser)
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    /**
     * 更新事件 / Update event
     */
    public EventResponse updateEvent(String id, EventRequest request) {
        User currentUser = getCurrentUser();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Basic authorization check - only creator (or Admin) can update
        if (!event.getCreator().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to update this event");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setCategory(request.getCategory());
        event.setPriority(request.getPriority());
        event.setRepeatType(request.getRepeatType());

        Event updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }

    /**
     * 刪除事件 / Delete event
     */
    public void deleteEvent(String id) {
        User currentUser = getCurrentUser();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        if (!event.getCreator().getId().equals(currentUser.getId()) && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to delete this event");
        }

        eventRepository.deleteById(id);
    }

    private User getCurrentUser() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized");
        }
        String loginId = authentication.getName();
        return userRepository.findByUsernameOrEmployeeIdOrEmail(loginId, loginId, loginId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .category(event.getCategory())
                .priority(event.getPriority())
                .repeatType(event.getRepeatType())
                .creatorId(event.getCreator().getId())
                .creatorName(event.getCreator().getName())
                .build();
    }
}
