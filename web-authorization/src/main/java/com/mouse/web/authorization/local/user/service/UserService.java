package com.mouse.web.authorization.local.user.service;

import com.mouse.web.authorization.local.user.model.User;
import com.mouse.web.authorization.local.user.repository.UserRepository;
import com.mouse.web.supports.jpa.repository.BaseRepository;
import com.mouse.web.supports.jpa.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by cwx183898 on 2017/8/9.
 */
@Service
@Transactional
public class UserService extends BaseService<User, String> implements IUserService {
    @Autowired
    private UserRepository repository;

    @Override
    public BaseRepository<User, String> getRepository() {
        return repository;
    }

    @Override
    public User findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public <S extends User> S save(S entity) {
        if (entity.getId() != null) {
            User old = getRepository().findOne(entity.getId());
            if (!entity.getPassword().equals(old.getPassword())) {
                entity.setPassword(new Md5PasswordEncoder().encodePassword(entity.getPassword(), null));
            }
        }
        if (entity.getCreator() == null) {
            String creator = SecurityContextHolder.getContext().getAuthentication().getName();
            entity.setCreator(creator);
        }
        return super.save(entity);
    }

    @Override
    public void delete(String[] ids) {
        if (ids != null) {
            for (String id : ids) {
                repository.delete(id);
            }
        }
    }
}
