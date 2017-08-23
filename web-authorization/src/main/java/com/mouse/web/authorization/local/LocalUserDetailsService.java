package com.mouse.web.authorization.local;

import com.mouse.web.authorization.atapter.UserDetailsAdapter;
import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.service.IRoleService;
import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalUserDetailsService implements UserDetailsService {
    @Autowired
    private IUserService userService;
    @Autowired
    private IRoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            //预加载所有用户权限
            List<Role> roles = roleService.findByResource(user.getId());
            user.setRoles(roles);
            return new UserDetailsAdapter(user);
        }
        return null;
    }
}
