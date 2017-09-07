package com.mouse.web.example;

import com.mouse.web.supports.jpa.repository.ExtendRepositoryFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Created by cwx183898 on 2017/8/8.
 */
@SpringBootApplication()
@EnableJpaRepositories(basePackages = "com.mouse.*", repositoryFactoryBeanClass = ExtendRepositoryFactory.class)
public class ExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExampleApplication.class, args);
    }
}
