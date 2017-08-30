package com.mouse.web.authorization.local.user.service;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private UserRepository repository;

    @Override
    public User findByUsername(String username) {
        return repository.findByUsername(username);
    }


    @Override
    public User save(User user) {
        User result = repository.save(user);
        return result;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<User> findAll(Map<String, Object> params, Pageable pageable) {
        return repository.findAll(params, pageable);
    }

    @Override
    public User findById(String id) {
        return repository.findOne(id);
    }

    @Override
    public boolean delete(String id) {
        repository.delete(id);
        return true;
    }

    @Override
    public boolean delete(String[] ids) {
        if (ids != null) {
            for (String id : ids) {
                repository.delete(id);
            }
        }
        return true;
    }
}
