package com.erp.config;

import com.erp.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * @file UserAdapter.java
 * @description 使用者適配器 / User Adapter
 * @description_en Adapts User entity to Spring Security UserDetails
 * @description_zh 將 User 實體轉接為 Spring Security 所需的 UserDetails
 */
public class UserAdapter implements UserDetails {

    private final User user;

    public UserAdapter(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        if (user.getUsername() != null && !user.getUsername().isEmpty()) {
            return user.getUsername();
        }
        if (user.getEmployeeId() != null && !user.getEmployeeId().isEmpty()) {
            return user.getEmployeeId();
        }
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
