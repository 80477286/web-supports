package com.mouse.web.authorization.local.role.service;

import com.mouse.web.authorization.local.role.model.Role;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
public interface IRoleService {
    List<Role> findAll();

    List<Role> findByResource(String rid);

    List<Role> findByUser(String uid);
}
