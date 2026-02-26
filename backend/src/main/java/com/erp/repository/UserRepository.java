package com.erp.repository;

import com.erp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @file UserRepository.java
 * @description 使用者資料存取層 / User Repository
 * @description_en Data access for User entity
 * @description_zh 使用者實體的資料存取介面
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * 透過 Email 尋找使用者
     * 
     * @param email User email
     * @return Optional User
     */
    Optional<User> findByEmail(String email);

    /**
     * 透過 Username 或 EmployeeID 或 Email 尋找使用者
     *
     * @param username   Username
     * @param employeeId Employee ID
     * @param email      Email
     * @return Optional User
     */
    Optional<User> findByUsernameOrEmployeeIdOrEmail(String username, String employeeId, String email);

    /**
     * 檢查 Email 是否存在
     * 
     * @param email User email
     * @return boolean
     */
    boolean existsByEmail(String email);
}
