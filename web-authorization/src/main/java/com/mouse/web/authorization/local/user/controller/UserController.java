package com.mouse.web.authorization.local.user.controller;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.service.IUserService;
import com.mouse.web.supports.mvc.bind.annotation.EntityParam;
import com.mouse.web.supports.mvc.bind.annotation.JsonReturn;
import com.mouse.web.supports.mvc.bind.annotation.MapParam;
import com.mouse.web.supports.mvc.request.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/10.
 */
@RestController
public class UserController {
    @Autowired
    private IUserService userService;


    @RequestMapping(value = "/authorization/user/save")
    public User save(@EntityParam User user) {
        user.setPassword(new Md5PasswordEncoder().encodePassword(user.getPassword(), null));
        User result = userService.save(user);
        return result;
    }


    @RequestMapping(value = "/authorization/user/query")
    @JsonReturn(excludeProperties = ".*\\.roles")
    public Page<User> query(@MapParam Map<String, Object> params, @EntityParam PageParam pageable) {
        return userService.findAll(params, pageable);
    }
}
