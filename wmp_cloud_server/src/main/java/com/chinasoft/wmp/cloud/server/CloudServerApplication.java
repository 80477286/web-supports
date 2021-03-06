package com.chinasoft.wmp.cloud.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Created by cwx183898 on 2017/5/19.
 */
@SpringBootApplication
@EnableEurekaServer
public class CloudServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloudServerApplication.class, args);
    }
}
