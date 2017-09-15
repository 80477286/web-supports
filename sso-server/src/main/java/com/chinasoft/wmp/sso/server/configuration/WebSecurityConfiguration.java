package com.chinasoft.wmp.sso.server.configuration;

import com.mouse.web.authorization.local.WebLocalSecurityConfigurerAdapter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Configuration
@EnableAuthorizationServer
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class WebSecurityConfiguration extends WebLocalSecurityConfigurerAdapter {
    private static final Log LOGGER = LogFactory.getLog(com.chinasoft.wmp.sso.server.configuration.WebSecurityConfiguration.class);


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String permits = this.getPermits();
        String[] matchers = StringUtils.isEmpty(permits) ? new String[0] : getPermits().split("[,]");
        LOGGER.info("自定义免验证地址列表：" + Arrays.toString(matchers));

        http.authorizeRequests().antMatchers(matchers).permitAll();
        http.authorizeRequests().anyRequest().authenticated();

        http.formLogin().loginPage("/login").permitAll();
        http.logout().permitAll();
        http.csrf().disable();
    }
}
