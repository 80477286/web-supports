package com.mouse.web.authorization.local;

import com.mouse.web.authorization.configuration.BaseWebSecurityConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

/**
 * Created by cwx183898 on 2017/8/3.
 */
public class WebLocalSecurityConfigurerAdapter extends BaseWebSecurityConfiguration {

    @Autowired
    private LocalSecurityMetadataSource securityMetadataSource;
    @Autowired
    private LocalAccessDecisionManager accessDecisionManager;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String[] matchers = (getPermits() == null || getPermits().trim().isEmpty()) ? new String[0] : getPermits().split("[,]");
        http
                .authorizeRequests()
                //免验证地址
                .antMatchers(matchers).permitAll()
                //除免验证地址外其它所有地址都需要验证
                .anyRequest().authenticated()
                .and().formLogin().permitAll()
                .and().logout().permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService())
                .passwordEncoder(passwordEncoder());
        auth.eraseCredentials(false);
    }

    /**
     * 设置用户密码的加密方式为MD5加密
     *
     * @return
     */
    @Bean
    public Md5PasswordEncoder passwordEncoder() {
        return new Md5PasswordEncoder();
    }


    @Bean
    protected LocalUserDetailsService userDetailsService() {
        return new LocalUserDetailsService();
    }

    @Bean
    public FilterSecurityInterceptor filterSecurityInterceptor() {
        FilterSecurityInterceptor fsi = new FilterSecurityInterceptor();
        fsi.setSecurityMetadataSource(securityMetadataSource);
        fsi.setAccessDecisionManager(accessDecisionManager);
        return fsi;
    }

}