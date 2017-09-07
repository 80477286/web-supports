package com.mouse.web.supports.autoconfigure;

import com.mouse.web.supports.jpa.repository.BaseRepository;
import com.mouse.web.supports.jpa.repository.ExtendRepositoryFactory;
import com.mouse.web.supports.model.BaseEntity;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(repositoryFactoryBeanClass = ExtendRepositoryFactory.class)
@ConditionalOnBean(value = BaseRepository.class)
public class EnableExtendRepositoryConfiguration {
    public EnableExtendRepositoryConfiguration() {
        System.out.println("Load:EnableExtendRepositoryConfiguration");
    }
}
