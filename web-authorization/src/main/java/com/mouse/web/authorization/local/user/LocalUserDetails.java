package com.mouse.web.authorization.local.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Date;
import java.util.List;

public class LocalUserDetails extends User {
    private String name;
    private String email;


    public LocalUserDetails(com.mouse.web.authorization.local.user.model.User user, List<GrantedAuthority> gas) {

        this(user.getUsername(),
                user.getPassword(), user.getEnabled(),
                user.getAccountExpiringDate() == null || user.getAccountExpiringDate().getTime() > new Date().getTime() ? true : false,
                user.getCredentialsExpiringDate() == null || user.getCredentialsExpiringDate().getTime() > new Date().getTime() ? true : false,
                !user.getLocked(),
                gas);
        this.name = user.getName();
        this.email = user.getEmail();
    }

    public LocalUserDetails(String username, String password,
                            Collection<? extends GrantedAuthority> authorities) {
        super(username, password, true, true, true, true, authorities);
    }

    public LocalUserDetails(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
