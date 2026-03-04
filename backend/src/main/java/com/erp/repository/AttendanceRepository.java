package com.erp.repository;

import com.erp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * @file AttendanceRepository.java
 * @description 員工打卡紀錄資料庫操作 / Employee Attendance Repository
 * @description_en Repository for managing Attendance records in the database
 * @description_zh 管理員工出勤紀錄的實體資料庫存取層
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {

    // 查詢特定員工某日的打卡紀錄
    Optional<Attendance> findByUserIdAndWorkDate(String userId, LocalDate workDate);

    // 查詢特定員工在特定時間區間內的打卡紀錄 (用途：當月出勤表)
    List<Attendance> findByUserIdAndWorkDateBetweenOrderByWorkDateDesc(String userId, LocalDate startDate,
            LocalDate endDate);
}
