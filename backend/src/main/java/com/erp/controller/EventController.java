package com.erp.controller;

import com.erp.dto.ApiResponse;
import com.erp.dto.EventRequest;
import com.erp.dto.EventResponse;
import com.erp.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @file EventController.java
 * @description 行事曆事件控制器 / Event Controller
 * @description_en Rest API for calendar event management
 * @description_zh 行事曆事件的 Rest API 接口
 */
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents() {
        return ResponseEntity
                .ok(ApiResponse.success("Events retrieved successfully", eventService.getMyEvents()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@RequestBody EventRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success("Event created successfully", eventService.createEvent(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable String id,
            @RequestBody EventRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success("Event updated successfully", eventService.updateEvent(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
