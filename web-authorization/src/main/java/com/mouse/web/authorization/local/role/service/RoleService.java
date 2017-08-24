package com.mouse.web.authorization.local.role.service;

import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
public class RoleService implements IRoleService {
    @Autowired
    private RoleRepository repository;

    @Override
    public Role save(Role role) {
        return repository.save(role);
    }

    @Override
    public List<Role> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Role> findByResource(String rid) {
        return repository.findByResource(rid);
    }

    @Override
    public List<Role> findByUser(String uid) {
        return repository.findByUser(uid);
    }
}
