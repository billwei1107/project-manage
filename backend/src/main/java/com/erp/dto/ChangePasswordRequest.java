package com.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file ChangePasswordRequest.java
 * @description 修改密碼請求資料傳輸物件 / Change Password Request DTO
 * @description_en Data Transfer Object for processing password change requests
 * @description_zh 處理使用者修改密碼請求的 DTO
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
