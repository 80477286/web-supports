package com.mouse.web.example;

import com.mouse.web.authorization.ll.WebLdapAndLocalSecurityConfigurerAdapter;
import com.mouse.web.supports.jpa.repository.RepositoryFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Configuration
public class SecurityConfiguration extends WebLdapAndLocalSecurityConfigurerAdapter {
    @Override
    public String getPermits() {
        return "/,/index.html,/**/*.css,/**/*.js,/**/*.gif,/**/*.jpg,/**/*.bmp,/**/*.png,/**/*.ico";
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http.csrf().disable();
    }
}
