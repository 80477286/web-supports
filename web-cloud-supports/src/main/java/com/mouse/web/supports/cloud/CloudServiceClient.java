package com.mouse.web.supports.cloud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Service
public class CloudServiceClient {
    @Autowired
    private DiscoveryClient client;


    public Map postForEntity(String serverId, String url, @RequestParam LinkedMultiValueMap params) {
        List<ServiceInstance> instances = client.getInstances(serverId);
        if (instances != null && !instances.isEmpty()) {
            ServiceInstance instance = instances.get(0);
            URI uri = instance.getUri();
            HttpHeaders headers = new HttpHeaders();
            OAuth2Authentication oAuth2Authentication = (OAuth2Authentication) SecurityContextHolder.getContext().getAuthentication();
            OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) oAuth2Authentication.getDetails();
            String token = details.getTokenValue();
            String tokenType = details.getTokenType();
            headers.set("Authorization", tokenType + " " + token);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity entity = new HttpEntity(params, headers);
            Map result = (new RestTemplate()).postForEntity(uri.toString() + url, entity, Map.class).getBody();
            return result;
        }
        return null;
    }
}
