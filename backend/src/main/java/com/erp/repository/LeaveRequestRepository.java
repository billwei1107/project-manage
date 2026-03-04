package com.erp.repository;

import com.erp.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @file LeaveRequestRepository.java
 * @description 員工請假單資料庫操作 / Employee Leave Request Repository
 * @description_en Repository for managing LeaveRequest records in the database
 * @description_zh 管理員工請假申請的實體資料庫存取層
 */
@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    // 查詢特定員工的所有請假申請
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(String userId);

    // 查詢狀態為待簽核的所有申請 (供主管/HR 使用)
    List<LeaveRequest> findByStatusOrderByCreatedAtAsc(LeaveRequest.Status status);
}
