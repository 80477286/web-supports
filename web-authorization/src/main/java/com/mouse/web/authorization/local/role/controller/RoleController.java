package com.mouse.web.authorization.local.role.controller;

import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.service.IRoleService;
import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.jpa.controller.BaseController;
import com.mouse.web.supports.jpa.service.IBaseService;
import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import com.mouse.web.supports.mvc.bind.annotation.JSON;
import com.mouse.web.supports.mvc.bind.annotation.MapParam;
import com.mouse.web.supports.mvc.request.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/10.
 */
@RestController
@RequestMapping({"/authorization/role", "/api/authorization/role"})
public class RoleController extends BaseController<Role, String> {
    @Autowired
    private IRoleService roleService;

    @Override
    protected IBaseService<Role, String> getService() {
        return roleService;
    }

    @JSON(excludeProperties = "data.*\\.resources")
    public Role save(@EntityParam Role role) {
        return super.save(role);
    }

    @Override
    @JSON(excludeProperties = "data.*\\.resources\\.roles,data.*\\.users\\.roles")
    public Role getById(String id) {
        return super.getById(id);
    }

    @JSON(excludeProperties = "data.*\\.resources,data.*\\.users")
    public Page<Role> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return super.query(params, pageable);
    }
}
