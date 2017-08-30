package com.mouse.web.authorization.local.user.service;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.jpa.service.IBaseService;

/**
 * Created by cwx183898 on 2017/8/9.
 */
public interface IUserService extends IBaseService<User, String> {

    User findByUsername(String username);

    void delete(String[] ids);

}
