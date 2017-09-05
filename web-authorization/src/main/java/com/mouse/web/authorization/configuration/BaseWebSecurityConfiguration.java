package com.mouse.web.authorization.configuration;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by cwx183898 on 2017/8/14.
 */


@EnableJpaRepositories(basePackages = "com.mouse.*")
@EntityScan(basePackages = "com.mouse.*")
@ComponentScan(basePackages = {"com.mouse.*"})
public class BaseWebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    protected String permits = "";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String[] matchers = (getPermits() == null || getPermits().trim().isEmpty()) ? new String[0] : getPermits().split("[,]");
        http.authorizeRequests()
                //免验证地址
                .antMatchers(matchers).permitAll()
                //除免验证地址外其它所有地址都需要验证
                .anyRequest().authenticated()
                .and().formLogin().permitAll()
                .and().logout().permitAll();
    }

    public String getPermits() {
        return permits;
    }
}
