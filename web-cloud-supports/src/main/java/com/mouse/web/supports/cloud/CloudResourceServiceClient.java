package com.mouse.web.supports.cloud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.SourceHttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CloudResourceServiceClient {

    @Qualifier("oauth2ClientContext")
    @Autowired
    private OAuth2ClientContext clientContext;

    @NestedConfigurationProperty
    private AuthorizationCodeResourceDetails client = new AuthorizationCodeResourceDetails();

    @Autowired
    private DiscoveryClient discoveryClient;

    protected void init() {
        List messageConverters = new ArrayList();
        messageConverters.add(new SourceHttpMessageConverter());
        messageConverters.add(new FormHttpMessageConverter());
        messageConverters.add(new MappingJackson2HttpMessageConverter());
    }

    public ResponseEntity<Object> postForEntity(String serverId, String url, Object request, Object... uriVariables)
            throws RestClientException {
        String host = getServerUri(serverId);
        return restTemplate().postForEntity(host + url, request, Object.class, uriVariables);
    }

    public <T> ResponseEntity<T> postForEntity(String serverId, String url, Object request, Class<T> responseType, Object... uriVariables)
            throws RestClientException {
        String host = getServerUri(serverId);
        return restTemplate().postForEntity(host + url, request, responseType, uriVariables);
    }

    @Bean
    public OAuth2RestTemplate restTemplate() {
        OAuth2RestTemplate restTemplate = new OAuth2RestTemplate(client, clientContext);
        List messageConverters = new ArrayList();
        messageConverters.add(new SourceHttpMessageConverter());
        messageConverters.add(new FormHttpMessageConverter());
        messageConverters.add(new MappingJackson2HttpMessageConverter());
        restTemplate.setMessageConverters(messageConverters);
        return restTemplate;
    }

    private String getServerUri(String serverId) {
        List<ServiceInstance> instances = discoveryClient.getInstances(serverId);
        if (instances != null && !instances.isEmpty()) {
            ServiceInstance instance = instances.get(0);
            URI uri = instance.getUri();
            return uri.toString();
        }
        return null;
    }

    public OAuth2ProtectedResourceDetails getClient() {
        return client;
    }
}
