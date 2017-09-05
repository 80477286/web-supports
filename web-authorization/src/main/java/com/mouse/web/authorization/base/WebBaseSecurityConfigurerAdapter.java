package com.mouse.web.authorization.base;

import com.mouse.web.authorization.configuration.BaseWebSecurityConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

/**
 * Created by cwx183898 on 2017/8/3.
 */
public class WebBaseSecurityConfigurerAdapter extends BaseWebSecurityConfiguration {


    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("user").password("user").roles("USER")
                .and().withUser("admin").password("admin").roles("ADMIN");
    }
}