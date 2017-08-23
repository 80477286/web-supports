package com.mouse.web.authorization.atapter;

import com.mouse.web.authorization.local.role.model.Role;
import org.springframework.security.core.GrantedAuthority;


public class GrantedAuthorityAdapter implements GrantedAuthority {
    private static final long serialVersionUID = -5524723369491654233L;

    private Role role;

    public GrantedAuthorityAdapter(Role role) {
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return role.getName();
    }

    public Role getRole() {
        return role;
    }
}
