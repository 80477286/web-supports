package com.mouse.web.authorization.local.user.controller;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import com.mouse.web.supports.mvc.bind.annotation.JSON;
import com.mouse.web.supports.mvc.bind.annotation.MapParam;
import com.mouse.web.supports.mvc.request.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/10.
 */
@RestController
public class UserController {
    @Autowired
    private IUserService userService;


    @RequestMapping(value = "/authorization/user/save")
    @JSON(excludeProperties = "data.*\\.roles")
    public User save(Principal principal, @EntityParam User user) {
        user.setPassword(new Md5PasswordEncoder().encodePassword(user.getPassword(), null));
        if (user.getCreator() == null) {
            user.setCreator(principal.getName());
        }
        User result = userService.save(user);
        return result;
    }

    @RequestMapping(value = "/authorization/user/get_by_id")
    @JSON(excludeProperties = "data.*\\.roles\\.resources")
    public User getById(String id) {
        User result = userService.findById(id);
        return result;
    }

    @RequestMapping(value = "/authorization/user/delete")
    @JSON()
    public boolean delete(String[] ids) {
        boolean result = userService.delete(ids);
        return result;
    }

    @RequestMapping(value = "/authorization/user/query")
    @JSON(excludeProperties = "data.*\\.roles")
    public Page<User> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return userService.findAll(params, pageable);
    }
}
