package com.erp.repository;

import com.erp.entity.Event;
import com.erp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @file EventRepository.java
 * @description 事件資料庫操作介面 / Event Repository
 * @description_en Database operations for calendar events
 * @description_zh 提供行事曆事件的資料庫 CRUD 操作與自定義查詢
 */
@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    /**
     * Get all events created by a specific user or associated with them
     */
    List<Event> findByCreatorOrderByStartDateAsc(User creator);
}
