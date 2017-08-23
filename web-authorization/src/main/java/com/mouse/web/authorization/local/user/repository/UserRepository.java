package com.mouse.web.authorization.local.user.repository;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.supports.jpa.repository.BaseRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Repository
public interface UserRepository extends BaseRepository<User, String> {
    User findByUsername(String username);
}
