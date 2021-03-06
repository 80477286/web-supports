package com.mouse.web.authorization.local.role.service;

import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.jpa.service.IBaseService;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
public interface IRoleService extends IBaseService<Role, String> {

    List<Role> findByResource(String rid);

    List<Role> findByUser(String uid);
}
