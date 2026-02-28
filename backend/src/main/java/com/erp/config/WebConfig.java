package com.erp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @file WebConfig.java
 * @description 網頁配置 / Web Config
 * @description_en Configures CORS settings
 * @description_zh 配置跨域資源共享 (CORS)
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allow all origins for development
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(
            org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        // Expose the uploads directory so receipts can be accessed directly
        registry.addResourceHandler("/api/v1/finance/receipts/**")
                .addResourceLocations("file:uploads/");
    }
}
