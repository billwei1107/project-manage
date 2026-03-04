package com.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
@org.springframework.data.jpa.repository.config.EnableJpaAuditing
public class ErpApplication {

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Taipei"));
    }

    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
    }

}
