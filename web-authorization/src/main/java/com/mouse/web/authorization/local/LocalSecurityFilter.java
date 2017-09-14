package com.mouse.web.authorization.local;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.access.intercept.AbstractSecurityInterceptor;
import org.springframework.security.access.intercept.InterceptorStatusToken;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.*;
import java.io.IOException;

@SuppressWarnings("ALL")
@Service
public class LocalSecurityFilter extends AbstractSecurityInterceptor implements Filter {


    @Autowired
    private LocalSecurityMetadataSource securityMetadataSource;

    @Autowired
    private LocalAccessDecisionManager accessDecisionManager;

    @PostConstruct
    public void init() {
        super.setAccessDecisionManager(accessDecisionManager);
    }

    public void destroy() {
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        FilterInvocation fileInvocation = new FilterInvocation(request, response, chain);
        invoke(fileInvocation);
    }

    public void invoke(FilterInvocation fi) throws IOException, ServletException {

        InterceptorStatusToken token = super.beforeInvocation(fi);

        try {
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } finally {
            super.finallyInvocation(token);
        }

        super.afterInvocation(token, null);
    }

    public FilterInvocationSecurityMetadataSource getSecurityMetadataSource() {
        return this.securityMetadataSource;
    }

    public SecurityMetadataSource obtainSecurityMetadataSource() {
        return this.securityMetadataSource;
    }


    public Class<?> getSecureObjectClass() {
        return FilterInvocation.class;
    }

}
