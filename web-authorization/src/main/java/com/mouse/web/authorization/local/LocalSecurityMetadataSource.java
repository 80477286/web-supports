package com.mouse.web.authorization.local;

import com.mouse.web.authorization.local.resource.model.Resource;
import com.mouse.web.authorization.local.resource.service.IResourceService;
import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.service.IRoleService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


@Service
public class LocalSecurityMetadataSource implements
        FilterInvocationSecurityMetadataSource {
    protected static final Logger LOG = Logger
            .getLogger(LocalSecurityMetadataSource.class);

    @Autowired
    private IResourceService resourceService;

    @Autowired
    private IRoleService roleServices;

    protected PathMatcher antPathMatcher = new AntPathMatcher();


    /**
     * 从数据库中查询所有有效资源
     *
     * @return
     */
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        LOG.debug("获取资源列表:getAllConfigAttributes()");
        Collection<ConfigAttribute> configAttributes = new ArrayList<ConfigAttribute>();
        List<Resource> resources = resourceService.findAll();
        if (resources == null) {
            return configAttributes;
        }
        for (Resource resource : resources) {
            if (resource.getUrl() != null && !resource.getUrl().trim().isEmpty()) {
                resource.getRoles();
                configAttributes.add(resource);
            }
        }
        return configAttributes;
    }

    public boolean supports(Class<?> clazz) {
        return true;
    }

    // 返回所请求资源所需要的权限(对应系统中的角色)
    @Override
    public Collection<ConfigAttribute> getAttributes(Object object)
            throws IllegalArgumentException {
        String requestUrl = getUrl(object);
        Collection<ConfigAttribute> roles = new ArrayList<ConfigAttribute>();
        Collection<ConfigAttribute> resources = getAllConfigAttributes();
        for (ConfigAttribute ca : resources) {
            //resource.getAttribute()实际上是取Resource中的url属性
            boolean matched = antPathMatcher.match(ca.getAttribute(), requestUrl);
            if (matched) {
                Resource resource = (Resource) ca;
                if (resource.getRoles() != null) {
                    List<Role> list = roleServices.findByResource(resource.getId());
                    roles.addAll(list);
                }
                break;
            }
        }
        return roles;
    }

    /**
     * 处理带有扩展名的URL(.action/.jsp等)
     *
     * @param object
     * @return
     */
    private String getUrl(Object object) {
        FilterInvocation filterInvocation = (FilterInvocation) object;
        String requestUrl = filterInvocation.getRequestUrl();
        LOG.debug("Request URL:" + requestUrl);
        return requestUrl;
    }
}
