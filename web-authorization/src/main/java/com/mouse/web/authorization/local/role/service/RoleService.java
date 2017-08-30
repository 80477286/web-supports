package com.mouse.web.authorization.local.role.service;

import com.mouse.web.authorization.local.role.model.Role;
import com.mouse.web.authorization.local.role.repository.RoleRepository;
import com.mouse.web.supports.jpa.repository.BaseRepository;
import com.mouse.web.supports.jpa.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
public class RoleService extends BaseService<Role, String> implements IRoleService {
    @Autowired
    private RoleRepository repository;

    @Override
    public List<Role> findByResource(String rid) {
        return repository.findByResource(rid);
    }

    @Override
    public List<Role> findByUser(String uid) {
        return repository.findByUser(uid);
    }

    @Override
    public BaseRepository<Role, String> getRepository() {
        return repository;
    }
}
