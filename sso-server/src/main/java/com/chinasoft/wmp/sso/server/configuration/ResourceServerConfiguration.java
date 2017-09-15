package com.chinasoft.wmp.sso.server.configuration;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
    private static final Log LOGGER = LogFactory.getLog(com.chinasoft.wmp.sso.server.configuration.ResourceServerConfiguration.class);

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.requestMatchers().antMatchers("/resource/**").and().authorizeRequests().anyRequest().authenticated();

        // http.antMatcher("/resource/**").authorizeRequests().anyRequest().authenticated();
    }
}
