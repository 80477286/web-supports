package com.mouse.web.example;

import com.mouse.web.authorization.ll.WebLdapAndLocalSecurityConfigurerAdapter;
import com.mouse.web.authorization.local.WebLocalSecurityConfigurerAdapter;
import com.mouse.web.supports.jpa.repository.RepositoryFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.util.StringUtils;

import java.util.Arrays;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Configuration
public class SecurityConfiguration extends WebLocalSecurityConfigurerAdapter {
    private static final Log LOGGER = LogFactory.getLog(SecurityConfiguration.class);

    public String getPermits() {
        return "/,/about,/index,/index.html,/extends/*,/**/*.css,/**/*.js,/**/*.gif,/**/*.jpg,/**/*.bmp,/**/*.png,/**/*.ico";
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        String permits = this.getPermits();
        String[] matchers = StringUtils.isEmpty(permits) ? new String[0] : getPermits().split("[,]");
        LOGGER.info("自定义免验证地址列表：" + Arrays.toString(matchers));

        http.authorizeRequests().antMatchers(matchers).permitAll();
        http.authorizeRequests().anyRequest().authenticated();

        http.formLogin().loginPage("/login").permitAll();
        http.logout().logoutSuccessUrl("/").permitAll();
        http.csrf().disable();//csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }
}
