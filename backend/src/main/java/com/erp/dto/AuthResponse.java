package com.erp.dto;

import com.erp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file AuthResponse.java
 * @description 認證回應 DTO / Auth Response DTO
 * @description_en Data Transfer Object for authentication response
 * @description_zh 認證回應資料傳輸物件，包含 Token 與 user info
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserInfo user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private String id;
        private String name;
        private String username;
        private String employeeId;
        private String email;
        private User.Role role;
    }
}
