package com.mouse.web.authorization.local;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Iterator;


@Service
public class LocalAccessDecisionManager implements AccessDecisionManager {
    public void decide(Authentication authentication, Object object, Collection<ConfigAttribute> configAttributes)
            throws AccessDeniedException {

        if (configAttributes == null) {
            return;
        }
        // 所请求的资源拥有的权限(一个资源对多个权限)
        Iterator<ConfigAttribute> iterator = configAttributes.iterator();

        ConfigAttribute configAttribute = null;
        String needPermission = null;
        boolean hashNext = iterator.hasNext();
        while (hashNext) {
            configAttribute = iterator.next();
            // 访问所请求资源所需要的权限
            needPermission = configAttribute.getAttribute();
            // 用户所拥有的权限authentication
            for (GrantedAuthority ga : authentication.getAuthorities()) {
                if (needPermission.equals(ga.getAuthority())) {
                    return;
                }
            }
            hashNext = iterator.hasNext();
        }
        // 没有权限让我们去捕捉
        throw new AccessDeniedException("没有权限访问！");
    }

    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    public boolean supports(Class<?> clazz) {
        return true;
    }

}
