package com.mouse.web.authorization.base;

import com.mouse.web.authorization.configuration.WebSecurityConfigurationSupports;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Created by cwx183898 on 2017/8/3.
 */
public class WebBaseSecurityConfigurerAdapter extends WebSecurityConfigurationSupports {


    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("user").password("user").roles("USER")
                .and().withUser("admin").password("admin").roles("ADMIN");
    }
}