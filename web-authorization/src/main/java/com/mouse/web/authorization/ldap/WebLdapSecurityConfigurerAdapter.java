package com.mouse.web.authorization.ldap;

import com.mouse.web.authorization.configuration.WebSecurityConfigurationSupports;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;

/**
 * Created by cwx183898 on 2017/8/3.
 */
public class WebLdapSecurityConfigurerAdapter extends WebSecurityConfigurationSupports {
    protected String searchBase = "ou=CorpUsers|ou=PartnerUsers";
    protected String searchFilter = "(samaccountname={0})";
    protected String providerUrl = "ldap://lggad05-dc/dc=china,dc=huawei,dc=com";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        String[] matchers = (getPermits() == null || getPermits().trim().isEmpty()) ? new String[0] : getPermits().split("[,]]");
        http.authenticationProvider(getAuthenticationProvider()).authorizeRequests()
                //免验证地址
                .antMatchers(matchers).permitAll()
                //除免验证地址外其它所有地址都需要验证
                .anyRequest().authenticated()
                .and().formLogin().permitAll()
                .and().logout().permitAll();
    }

    @Bean
    public LdapAuthenticationProvider getAuthenticationProvider() {
        LdapAuthenticationProvider authenticationProvider = new LdapAuthenticationProvider(getBindAuthenticator());
        return authenticationProvider;
    }

    @Bean
    public WebLdapBindAuthenticator getBindAuthenticator() {
        DefaultSpringSecurityContextSource contextSource = contextSource();
        WebLdapBindAuthenticator bindAuthenticator = new WebLdapBindAuthenticator(contextSource);
        bindAuthenticator.setUserSearch(new WebLdapUserSearchImpl(getSearchBase(), getSearchFilter(), contextSource));
        return bindAuthenticator;
    }

    @Bean
    public DefaultSpringSecurityContextSource contextSource() {
        DefaultSpringSecurityContextSource cs = new DefaultSpringSecurityContextSource(getProviderUrl());
        return cs;
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