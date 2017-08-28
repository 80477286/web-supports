package com.mouse.web.authorization.ll;

import com.mouse.web.authorization.configuration.WebSecurityConfigurationSupports;
import com.mouse.web.authorization.ldap.WebLdapBindAuthenticator;
import com.mouse.web.authorization.ldap.WebLdapUserSearchImpl;
import com.mouse.web.authorization.local.LocalSecurityFilter;
import com.mouse.web.authorization.local.LocalUserDetailsService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.UserDetailsServiceLdapAuthoritiesPopulator;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

import java.util.Arrays;

/**
 * Created by cwx183898 on 2017/8/3.
 * 使用LDAP过行密码验证，本地进行资源权限验证
 */

public class WebLdapAndLocalSecurityConfigurerAdapter extends WebSecurityConfigurationSupports {
    private static final Log LOGGER = LogFactory.getLog(WebLdapAndLocalSecurityConfigurerAdapter.class);
    protected String searchBase = "ou=CorpUsers|ou=PartnerUsers";
    protected String searchFilter = "(samaccountname={0})";
    protected String providerUrl = "ldap://lggad05-dc/dc=china,dc=huawei,dc=com";


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String[] matchers = (getPermits() == null || getPermits().trim().isEmpty()) ? new String[0] : getPermits().split("[,]");
        LOGGER.info("自定义免验证地址列表：" + Arrays.toString(matchers));
        http.authenticationProvider(getAuthenticationProvider()).addFilterBefore(localSecurityFilter(), FilterSecurityInterceptor.class)
                .authorizeRequests()
                //免验证地址
                .antMatchers(matchers).permitAll()
                //除免验证地址外其它所有地址都需要验证
                .anyRequest().authenticated()
                .and().formLogin().permitAll()
                .and().logout().permitAll();
    }

    @Bean
    public LdapAuthenticationProvider getAuthenticationProvider() {
        LdapAuthenticationProvider authenticationProvider = new LdapAuthenticationProvider(getBindAuthenticator(), getLdapAuthoritiesPopulator());
        return authenticationProvider;
    }


    @Bean
    protected LocalSecurityFilter localSecurityFilter() {
        return new LocalSecurityFilter();
    }

    @Bean
    public LdapAuthoritiesPopulator getLdapAuthoritiesPopulator() {
        LdapAuthoritiesPopulator ldapAuthoritiesPopulator = new UserDetailsServiceLdapAndLocalAuthoritiesPopulator(userDetailsService());
        return ldapAuthoritiesPopulator;
    }


    @Bean
    public WebLdapBindAuthenticator getBindAuthenticator() {
        DefaultSpringSecurityContextSource contextSource = contextSource();
        WebLdapBindAuthenticator bindAuthenticator = new WebLdapBindAuthenticator(contextSource);
        WebLdapUserSearchImpl userSearch = new WebLdapUserSearchImpl(getSearchBase(), getSearchFilter(), contextSource);
        //配置需要从域目录中取出的属性列表
        userSearch.setReturningAttributes(new String[]{"mail", "name", "telephonenumber", "otherhomephone", "othertelephone"});
        bindAuthenticator.setUserSearch(userSearch);
        return bindAuthenticator;
    }

    @Bean
    public DefaultSpringSecurityContextSource contextSource() {
        DefaultSpringSecurityContextSource cs = new DefaultSpringSecurityContextSource(getProviderUrl());
        return cs;
    }

    @Bean
    protected LdapUserDetailsService userDetailsService() {
        return new LdapUserDetailsService();
    }

    public String getSearchBase() {
        return searchBase;
    }

    public String getSearchFilter() {
        return searchFilter;
    }

    public String getProviderUrl() {
        return providerUrl;
    }
}