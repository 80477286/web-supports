package com.mouse.web.authorization.local.user.service;

import com.mouse.web.authorization.local.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Created by cwx183898 on 2017/8/9.
 */
public interface IUserService {
    User findByUsername(String username);

    User save(User user);

    List<User> findAll();

    Page<User> findAll(Map<String, Object> params, Pageable pageable);
}
