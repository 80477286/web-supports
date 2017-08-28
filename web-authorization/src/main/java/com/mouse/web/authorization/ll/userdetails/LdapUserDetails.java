package com.mouse.web.authorization.ll.userdetails;

import com.mouse.web.authorization.local.user.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsImpl;

import java.util.Collection;
import java.util.Date;

/**
 * Created by user on 2017/8/28.
 */
public class LdapUserDetails extends LdapUserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 6251178934597843690L;

    private User user;

    private Collection<GrantedAuthority> authorities;

    public LdapUserDetails(User user, Collection<GrantedAuthority> authorities) {
        this.user = user;
        this.authorities = authorities;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * 返回用户所有的权限
     *
     * @return
     */
    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        if (user.getAccountExpiringDate() == null) {
            return false;
        }
        return !(new Date().getTime() >= user.getAccountExpiringDate().getTime());
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        if (user.getCredentialsExpiringDate() == null) {
            return false;
        }
        return !(new Date().getTime() >= user.getAccountExpiringDate().getTime());
    }

    @Override
    public boolean isEnabled() {
        return user.getEnabled();
    }

    @Override
    public String toString() {
        return "username:" + getUsername();
    }
}
