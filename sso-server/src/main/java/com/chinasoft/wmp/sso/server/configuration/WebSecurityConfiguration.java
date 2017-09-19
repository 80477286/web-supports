package com.chinasoft.wmp.sso.server.configuration;

import com.chinasoft.wmp.sso.server.filters.SessionChangedFilter;
import com.mouse.web.authorization.local.WebLocalSecurityConfigurerAdapter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Configuration
@EnableAuthorizationServer
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class WebSecurityConfiguration extends WebLocalSecurityConfigurerAdapter {
    private static final Log LOGGER = LogFactory.getLog(com.chinasoft.wmp.sso.server.configuration.WebSecurityConfiguration.class);

    //SSO登录成功后修改Session时更改用户详细信息，将修改后的SessionID更新到authentication的details中，以便Oauth2客户端获取到此SessionID用于注销
    private SessionChangedFilter sessionChangedFilter() {
        return new SessionChangedFilter("/login");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //将SessionChangedFilter添加到用户名密码验证之后（用户名密码验证成功之后将会更新SessionID）
        http.addFilterAfter(sessionChangedFilter(), UsernamePasswordAuthenticationFilter.class);
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
