package com.mouse.web.authorization.ll;

import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.service.IRoleService;
import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class LdapUserDetailsService implements UserDetailsService {
    @Autowired
    private IUserService userService;
    @Autowired
    private IRoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            //预加载所有用户权限
            List<Role> roles = roleService.findByUser(user.getId());
            List<GrantedAuthority> gas = new ArrayList<GrantedAuthority>(0);
            for (Role role : roles) {
                gas.add(new SimpleGrantedAuthority(role.getId()));
            }
            boolean enabled = user.getEnabled();
            boolean accountNonExpired = user.getAccountExpiringDate() == null || user.getAccountExpiringDate().getTime() > new Date().getTime() ? true : false;
            boolean credentialsNonExpired = user.getCredentialsExpiringDate() == null || user.getCredentialsExpiringDate().getTime() > new Date().getTime() ? true : false;
            boolean accountNonLocked = !user.getLocked();
            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, gas);
        }
        return null;
    }
}
