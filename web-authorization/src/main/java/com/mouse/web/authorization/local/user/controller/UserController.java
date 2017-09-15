package com.mouse.web.authorization.local.user.controller;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
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
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.security.Security;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/10.
 */
@RestController
@RequestMapping({"/authorization/user", "/resource/authorization/user"})
public class UserController extends BaseController<User, String> {
    @Autowired
    private IUserService userService;

    @Override
    protected IBaseService<User, String> getService() {
        return userService;
    }

    @JSON(excludeProperties = "data.*\\.roles")
    public User save(@EntityParam User user) {
        User result = userService.save(user);
        return result;
    }

    @Override
    @JSON(excludeProperties = "data.*\\.roles\\.resources")
    public User getById(String id) {
        return super.getById(id);
    }

    @JSON(excludeProperties = "data.*\\.roles")
    public Page<User> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return super.query(params, pageable);
    }
}
