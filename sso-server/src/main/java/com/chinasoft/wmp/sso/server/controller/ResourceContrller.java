package com.chinasoft.wmp.sso.server.controller;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.resource.service.IResourceService;
import com.mouse.web.authorization.local.role.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.*;

@RestController
public class ResourceContrller {
    @Autowired
    private IResourceService resourceService;

    @RequestMapping({"/resource/get_all_resources"})
    public Map<String, List<String>> getAllResources(Principal principal) {
        Map<String, List<String>> data = new HashMap<String, List<String>>();
        List<Resource> resources = resourceService.query();
        for (Resource resource : resources) {
            List<String> list = new ArrayList<String>();
            List<Role> roles = resource.getRoles();
            if (roles != null) {
                for (Role role : roles) {
                    list.add(role.getId());
                }
            }
            data.put(resource.getUrl(), list);
        }
        return data;
    }

    @RequestMapping({"/resource/me"})
    public Object me(HttpServletRequest request, Principal principal) {
        Map<String, Object> map = new LinkedHashMap<String, Object>(3);
        map.put("name", principal.getName());
        if (principal instanceof OAuth2Authentication) {
            OAuth2Authentication oa = (OAuth2Authentication) principal;
            map.put("authorities", oa.getAuthorities());
            // map.put("userAuthentication", oa.getUserAuthentication());
            map.put("details", oa.getUserAuthentication().getDetails());
            return oa.getUserAuthentication();
        }
        return map;
    }
}
