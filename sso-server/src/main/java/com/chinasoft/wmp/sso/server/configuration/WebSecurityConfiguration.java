package com.chinasoft.wmp.sso.server.configuration;

import com.chinasoft.wmp.sso.server.controller.SessionUpdateFilter;
import com.mouse.web.authorization.local.WebLocalSecurityConfigurerAdapter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.token.ClientTokenServices;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.ServletRequestUtils;

import javax.servlet.ServletResponse;
import java.util.Arrays;

@Configuration
@EnableAuthorizationServer
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class WebSecurityConfiguration extends WebLocalSecurityConfigurerAdapter {
    private static final Log LOGGER = LogFactory.getLog(com.chinasoft.wmp.sso.server.configuration.WebSecurityConfiguration.class);

    @Autowired
    private SessionUpdateFilter sessionUpdateFilter() {
        return new SessionUpdateFilter("/login");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterAfter(sessionUpdateFilter(), UsernamePasswordAuthenticationFilter.class);
        String permits = this.getPermits();
        String[] matchers = StringUtils.isEmpty(permits) ? new String[0] : getPermits().split("[,]");
        LOGGER.info("自定义免验证地址列表：" + Arrays.toString(matchers));

        http.authorizeRequests().antMatchers(matchers).permitAll();
        http.authorizeRequests().anyRequest().authenticated();

        http.formLogin().loginPage("/login").permitAll();
        http.logout().logoutSuccessUrl("/login").permitAll();
        http.csrf().disable();
    }
}
