package com.mouse.web.authorization.ldap;

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.BaseLdapPathContextSource;
import org.springframework.security.core.Authentication;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;

public class WebLdapBindAuthenticator extends BindAuthenticator {

    public WebLdapBindAuthenticator(BaseLdapPathContextSource contextSource) {
        super(contextSource);
    }

    @Override
    public DirContextOperations authenticate(Authentication authentication) {
        DefaultSpringSecurityContextSource cs =
                (DefaultSpringSecurityContextSource) getContextSource();
        cs.setUserDn(authentication.getName() + "@china.huawei.com");
        cs.setPassword((String) authentication.getCredentials());
        return super.authenticate(authentication);
    }
}
