package com.chinasoft.wmp.sso.server.controller;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.mvc.bind.annotation.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Controller
public class GlobalController {
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @RequestMapping("/get_current_user")
    @ResponseBody
    @JSON
    public Map<String, Object> getCurrentUser(Principal principal) {
        Map<String, Object> data = new HashMap<String, Object>(0);
        UserDetails user = (UserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

        data.put("name", principal.getName());
        data.put("username", user.getUsername());
        data.put("authorities", user.getAuthorities());
        data.put("accountNonExpired", user.isAccountNonExpired());
        data.put("accountNonLocked", user.isAccountNonLocked());
        data.put("credentialsNonExpired", user.isCredentialsNonExpired());
        data.put("enabled", user.isEnabled());
        return data;
    }

    @RequestMapping("/get_localhost")
    @ResponseBody
    @JSON
    public String getLocalhost(HttpServletRequest request) {
        return request.getRemoteAddr();
    }

    @Autowired
    private TokenStore tokenStore;

    @RequestMapping(value = "/oauth/revoke-token")
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            String tokenValue = authHeader.replace("Bearer", "").trim();
            OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue);
            tokenStore.removeAccessToken(accessToken);
        }
    }
}
