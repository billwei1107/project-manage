package com.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file AuthRequest.java
 * @description 登入請求 DTO / Login Request DTO
 * @description_en Data Transfer Object for login credentials
 * @description_zh 登入請求資料傳輸物件
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
    private String loginId;
    private String password;
}
