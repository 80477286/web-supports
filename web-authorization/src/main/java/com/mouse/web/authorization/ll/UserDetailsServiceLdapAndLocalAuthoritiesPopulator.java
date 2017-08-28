package com.mouse.web.authorization.ll;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.ldap.authentication.UserDetailsServiceLdapAuthoritiesPopulator;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

/**
 * Created by cwx183898 on 2017/8/11.
 */
public class UserDetailsServiceLdapAndLocalAuthoritiesPopulator extends UserDetailsServiceLdapAuthoritiesPopulator {
    private LdapUserDetailsService ldapUserDetailsService;
    @Autowired
    private IUserService userService;

    public UserDetailsServiceLdapAndLocalAuthoritiesPopulator(LdapUserDetailsService ldapUserDetailsService) {
        super(ldapUserDetailsService);
        this.ldapUserDetailsService = ldapUserDetailsService;
    }

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData, String username) {
        UserDetails ud = ldapUserDetailsService.loadUserByUsername(username);
        if (ud == null) {
            //用户在本地不存在时创建新用户，并返回一个空的授权列表
            String mail = userData.getStringAttribute("mail");
            String name = userData.getStringAttribute("name");
            User user = new User();
            user.setEmail(mail);
            user.setUsername(username);
            user.setPassword(username);
            user.setName(name);
            user.setCreator("SYSTEM");
            user.setLocked(false);
            user.setAccountExpiringDate(DateUtils.addYears(new Date(), 1));
            user.setCredentialsExpiringDate(DateUtils.addYears(new Date(), 1));
            user = userService.save(user);
            return new ArrayList<GrantedAuthority>(0);
        } else {
            return ud.getAuthorities();
        }
    }
}
